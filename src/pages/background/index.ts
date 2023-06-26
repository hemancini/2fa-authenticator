import { sendMessageToClient } from "@src/chrome/message";
import { Encryption } from "@src/models/encryption";
import { getOTPAuthPerLineFromOPTAuthMigration } from "@src/models/migration";
import { EntryStorage, ManagedStorage } from "@src/models/storage";
import uuid from "uuid/v4";
import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss");

const cachedPassphrase = "";
let contentTab: chrome.tabs.Tab | undefined;

chrome.runtime.onConnect.addListener((port) => {
  port.onDisconnect.addListener(() => {
    console.log("Port disconnected");
  });
  port.onMessage.addListener(async (message: Message) => {
    console.log("onMessage() =>", message.type + ":", JSON.stringify(message.data));
    switch (message.type) {
      case "captureQR":
        try {
          await chrome.tabs.query({ active: true, lastFocusedWindow: true }).then(async (tab) => {
            if (!tab?.[0]?.id) {
              console.warn("captureQR: No active tab found");
              return;
            }
            await chrome.scripting.executeScript({
              target: { tabId: tab[0].id, allFrames: true },
              files: ["/src/pages/capture/index.js"],
            });
            await chrome.scripting.insertCSS({
              files: ["/assets/css/contentCapture.chunk.css"],
              target: { tabId: tab[0].id },
            });
            await chrome.tabs.sendMessage(tab[0].id, {
              action: "capture",
              info: message,
            });
            sendMessageToClient(port, {
              type: "captureQR",
              data: "received",
            });
          });
        } catch (error) {
          console.warn(error);
        }
        break;
      case "getCapture":
        try {
          await chrome.tabs.query({ active: true, lastFocusedWindow: true }).then(async (tab) => {
            if (!tab?.[0]?.id) {
              console.warn("getCapture: No active tab found");
              return;
            }
            const url = await getCapture(tab?.[0]);
            message.data.url = url;
            // TODO: replace with sendMessageToBackground
            chrome.tabs.sendMessage(contentTab.id, {
              action: "sendCaptureUrl",
              info: message.data,
            });
          });
        } catch (error) {
          console.warn(error);
        }
        break;
      case "getTotp":
        try {
          await getTotp(message.data);
          sendMessageToClient(port, {
            type: "getTotp",
            data: "received",
          });
        } catch (error) {
          console.warn(error);
        }
        break;
    }
  });
});

async function getCapture(tab: chrome.tabs.Tab) {
  const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, {
    format: "png",
  });
  contentTab = tab;
  return dataUrl;
}

async function getTotp(text: string, silent = false) {
  if (!contentTab || !contentTab.id || !text) {
    console.log("getTotp: No active tab found");
    return false;
  }
  const id = contentTab.id;

  if (text.indexOf("otpauth://") !== 0) {
    if (text.indexOf("otpauth-migration://") === 0) {
      const otpUrls = getOTPAuthPerLineFromOPTAuthMigration(text);
      if (otpUrls.length === 0) {
        !silent && chrome.tabs.sendMessage(id, { action: "errorenc" });
        return false;
      }

      const getTotpPromises: Array<Promise<boolean>> = [];
      for (const otpUrl of otpUrls) {
        getTotpPromises.push(getTotp(otpUrl, true));
      }

      const getTotpResults = await Promise.allSettled(getTotpPromises);
      const failedCount = getTotpResults.filter((res) => !res).length;
      if (failedCount === otpUrls.length) {
        !silent && chrome.tabs.sendMessage(id, { action: "migrationfail" });
        return false;
      }

      if (failedCount > 0) {
        !silent && chrome.tabs.sendMessage(id, { action: "migrationpartlyfail" });
        return true;
      }

      !silent && chrome.tabs.sendMessage(id, { action: "migrationsuccess" });
      return true;
    } else if (text === "error decoding QR Code") {
      !silent && chrome.tabs.sendMessage(id, { action: "errorqr" });
      return false;
    } else {
      !silent && chrome.tabs.sendMessage(id, { action: "text", text });
      return true;
    }
  } else {
    let uri = text.split("otpauth://")[1];
    let type = uri.substr(0, 4).toLowerCase();
    uri = uri.substr(5);
    let label = uri.split("?")[0];
    const parameterPart = uri.split("?")[1];
    if (!label || !parameterPart) {
      !silent && chrome.tabs.sendMessage(id, { action: "errorqr" });
      return false;
    } else {
      let secret = "";
      let account: string | undefined;
      let issuer: string | undefined;
      let algorithm: string | undefined;
      let period: number | undefined;
      let digits: number | undefined;

      try {
        label = decodeURIComponent(label);
      } catch (error) {
        console.warn(error);
      }
      if (label.indexOf(":") !== -1) {
        issuer = label.split(":")[0];
        account = label.split(":")[1];
      } else {
        account = label;
      }
      const parameters = parameterPart.split("&");
      parameters.forEach((item) => {
        const parameter = item.split("=");
        if (parameter[0].toLowerCase() === "secret") {
          secret = parameter[1];
        } else if (parameter[0].toLowerCase() === "issuer") {
          try {
            issuer = decodeURIComponent(parameter[1]);
          } catch {
            issuer = parameter[1];
          }
          issuer = issuer.replace(/\+/g, " ");
        } else if (parameter[0].toLowerCase() === "counter") {
          // let counter = Number(parameter[1]);
          // counter = isNaN(counter) || counter < 0 ? 0 : counter;
        } else if (parameter[0].toLowerCase() === "period") {
          period = Number(parameter[1]);
          period = isNaN(period) || period < 0 || period > 60 || 60 % period !== 0 ? undefined : period;
        } else if (parameter[0].toLowerCase() === "digits") {
          digits = Number(parameter[1]);
          digits = isNaN(digits) || digits === 0 ? 6 : digits;
        } else if (parameter[0].toLowerCase() === "algorithm") {
          algorithm = parameter[1];
        }
      });

      if (!secret) {
        !silent && chrome.tabs.sendMessage(id, { action: "errorqr" });
        return false;
      } else if (!/^[0-9a-f]+$/i.test(secret) && !/^[2-7a-z]+=*$/i.test(secret)) {
        !silent && chrome.tabs.sendMessage(id, { action: "secretqr", secret });
        return false;
      } else {
        const encryption = new Encryption(cachedPassphrase);
        const hash = await uuid();
        if (!/^[2-7a-z]+=*$/i.test(secret) && /^[0-9a-f]+$/i.test(secret) && type === "totp") {
          type = "hex";
        } else if (!/^[2-7a-z]+=*$/i.test(secret) && /^[0-9a-f]+$/i.test(secret) && type === "hotp") {
          type = "hhex";
        }
        const entryData: { [hash: string]: OTPStorage } = {};
        entryData[hash] = {
          account,
          hash,
          issuer,
          secret,
          type,
          encrypted: false,
          index: 0,
          counter: 0,
          pinned: false,
        };
        if (period) {
          entryData[hash].period = period;
        }
        if (digits) {
          entryData[hash].digits = digits;
        }
        if (algorithm) {
          entryData[hash].algorithm = algorithm;
        }
        if (
          // If the entries are encrypted and we aren't unlocked, error.
          (await EntryStorage.hasEncryptionKey()) !== encryption.getEncryptionStatus()
        ) {
          !silent && chrome.tabs.sendMessage(id, { action: "errorenc" });
          return false;
        }
        await EntryStorage.import(encryption, entryData);
        console.log("getTotp() => Added entry:", JSON.stringify(entryData[hash]));
        !silent && chrome.tabs.sendMessage(id, { action: "added", account });
        return true;
      }
    }
  }
}

console.log("background loaded");
