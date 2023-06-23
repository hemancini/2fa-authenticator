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

const storageKey = "pr-commit-noti-toast-config";

const cachedPassphrase = "";
let contentTab: chrome.tabs.Tab | undefined;

async function getTotp(text: string, silent = false) {
  if (!contentTab || !contentTab.id || !text) {
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
        console.error(error);
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
        console.log("account:", JSON.stringify(account, null, 2));
        console.log("entryData:", JSON.stringify(entryData, null, 2));
        if (
          // If the entries are encrypted and we aren't unlocked, error.
          (await EntryStorage.hasEncryptionKey()) !== encryption.getEncryptionStatus()
        ) {
          !silent && chrome.tabs.sendMessage(id, { action: "errorenc" });
          return false;
        }
        await EntryStorage.import(encryption, entryData);
        !silent && chrome.tabs.sendMessage(id, { action: "added", account });
        return true;
      }
    }
  }
}

chrome.runtime.onConnect.addListener((port) => {
  port.onDisconnect.addListener(() => {
    console.log("Port disconnected");
  });
});

chrome.runtime.onMessage.addListener(async (message: Message) => {
  switch (message.type) {
    case "captureQR":
      try {
        await chrome.tabs.query({ active: true, lastFocusedWindow: true }).then(async (tab) => {
          if (!tab?.[0]?.id) {
            console.log("captureQR: No active tab found");
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
          chrome.tabs.update(tab[0].id, { active: true }, (tab) => {
            console.log("captureQR: Tab updated");
          });
        });
      } catch (error) {
        console.error(error);
      }

      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (!tab || !tab.id) {
          return;
        }

        chrome.tabs.sendMessage(tab.id, {
          action: "capture",
          info: message,
        });
      });

      break;
    case "saveConfig":
      void chrome.storage.sync.set({ [storageKey]: message.data });
  }
});

async function getCapture(tab: chrome.tabs.Tab) {
  const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, {
    format: "png",
  });
  contentTab = tab;
  return dataUrl;
}

chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message.action === "getCapture") {
    if (!sender.tab) {
      return;
    }
    const url = await getCapture(sender.tab);
    console.log("contentTab:", JSON.stringify(contentTab));
    if (contentTab && contentTab.id) {
      console.log("contentTab:", contentTab);
      message.info.url = url;
      chrome.tabs.sendMessage(contentTab.id, {
        action: "sendCaptureUrl",
        info: message.info,
      });
    }
  } else if (message.action === "getTotp") {
    getTotp(message.info);
  }
  // https://stackoverflow.com/a/56483156
  return true;
});

console.log("background loaded");
