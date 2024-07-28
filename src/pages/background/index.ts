import { sendErrorMessageToClient, sendMessageToClient } from "@src/chrome/message";
import { Encryption } from "@src/models/legacy/crypto";
import { EntryStorage } from "@src/models/legacy/storage";
import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

import manifest from "../../../manifest";

reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss");

const cachedPassphrase = "";
const entrustSamlPath = "/#/saml/authentication/";

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(async (message: Message) => {
    try {
      const { type, data } = message;

      switch (type) {
        case "captureQR":
          {
            await captureQR();
            console.log("sendMessageToBackground/captureQR: received");
            sendMessageToClient(port, { type, data: "received" });
          }
          break;
        case "getCapture":
          await chrome.tabs.query({ active: true, lastFocusedWindow: true }).then(async (tab) => {
            if (!tab?.[0]?.id) {
              console.warn("getCapture: No active tab found");
              throw new Error("No active tab found");
            }
            const url = await getCapture(tab?.[0]);
            sendMessageToClient(port, {
              type: "getCapture",
              data: { ...data, url },
            });
          });
          break;
        case "getTotp":
          {
            const entry = await getTotp(data);
            console.log("sendMessageToBackground/getTotp:", entry);
            if (entry instanceof Error) {
              sendErrorMessageToClient(port, entry);
            } else {
              sendMessageToClient(port, {
                type: "getTotp",
                data: entry,
              });
            }
          }
          break;
        case "autofill":
          chrome.tabs.query({ active: true, lastFocusedWindow: true }, async (tabs) => {
            if (!tabs?.[0]?.id) {
              console.warn("autofill: No active tab found");
              throw new Error("No active tab found");
            }
            chrome.permissions.request(
              {
                permissions: ["tabs"],
                origins: [tabs?.[0]?.url],
              },
              async (granted) => {
                if (granted) {
                  await chrome.scripting.executeScript({
                    target: { tabId: tabs?.[0].id, allFrames: true },
                    files: ["/src/libs/autofill/index.js"],
                  });
                  chrome.tabs.sendMessage(tabs?.[0].id, {
                    message: "pastecode",
                    data: data,
                  });
                } else {
                  console.warn("autofill: Granted permission denied");
                  throw new Error("Granted permission denied");
                }
              }
            );
          });
          break;

        default:
          console.warn("Unknown message type", type);
      }
    } catch (error) {
      console.warn(error);
      sendErrorMessageToClient(port, error);
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    const url = tab?.url;
    if (!url) return;

    const contentScripts = manifest.content_scripts;
    const matches = contentScripts.map((contentScript) => contentScript.matches);
    const reduceMatches = matches.reduce((acumulador, array) => acumulador.concat(array), []);

    reduceMatches.map((match) => {
      const urlMatch = match?.replace("https://*.", "")?.replace("/*", "");
      const urlWhitPath = urlMatch + entrustSamlPath;
      if (url.includes(urlWhitPath)) {
        chrome.tabs.sendMessage(tab.id as number, {
          message: "bypass",
          data: "trustedauth",
        });
      }
    });
  }
});

chrome.commands.onCommand.addListener(async (command: string) => {
  if (command === "scan-qr") {
    await captureQR();
  }
});

async function captureQR() {
  await chrome.tabs.query({ active: true, lastFocusedWindow: true }).then(async (tab) => {
    if (!tab?.[0]?.id) {
      console.warn("captureQR: No active tab found");
      throw new Error("No active tab found");
    }
    await chrome.scripting.insertCSS({
      files: ["/assets/css/captureStyle.chunk.css"],
      target: { tabId: tab?.[0].id },
    });
    await chrome.scripting.executeScript({
      target: { tabId: tab?.[0].id, allFrames: true },
      files: ["/src/libs/capture/index.js"],
    });
    chrome.tabs.sendMessage(tab?.[0].id, { type: "capture" });
  });
}

async function getCapture(tab: chrome.tabs.Tab) {
  const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" });
  return dataUrl;
}

/**
 * @deprecated since version 1.3.0
 */
async function getTotp(message: { url: string; site: string }) {
  const { url, site } = message;
  const regexTotp = /^otpauth:\/\/totp\/.*[?&]secret=/;

  if (!regexTotp.test(url)) {
    console.warn("getTotp() => bad url", url);
    return Error("Bad url");
  }

  const hash = crypto.randomUUID();
  const urlObj = new URL(decodeURIComponent(url));
  const entryData: { [hash: string]: OTPStorage } = {};
  const period = parseInt(urlObj.searchParams.get("period") || "30");
  entryData[hash] = {
    hash,
    account: urlObj.pathname.split(":")[1],
    issuer: urlObj.searchParams.get("issuer"),
    secret: urlObj.searchParams.get("secret"),
    type: urlObj.pathname.split(":")[0].split("/")[2],
    encrypted: false,
    index: 0,
    counter: 0,
    pinned: false,
    period: isNaN(period) || period < 0 || period > 60 || 60 % period !== 0 ? undefined : period,
    digits: urlObj.searchParams.get("digits") === "8" ? 8 : 6,
    algorithm: urlObj.searchParams.get("algorithm") === "SHA256" ? "SHA256" : "SHA1",
    site,
  };

  if (!entryData[hash].issuer) {
    const pattern = /otpauth:\/\/totp\/([^:]+):/;
    const match = url.match(pattern);
    entryData[hash].issuer = match?.[1];
  }

  if (!entryData[hash].account) {
    const pattern = /otpauth:\/\/totp\/([^?:]+)/;
    const match = url.match(pattern);
    entryData[hash].account = match[1];
    if (!match?.[1]) {
      console.warn("getTotp() => no account", url);
      return Error("No account");
    }
  }

  if (!entryData[hash].secret) {
    console.warn("getTotp() => no secret", url);
    return Error("No secret");
  }

  // If the entries are encrypted and we aren't unlocked, error.
  const encryption = new Encryption(cachedPassphrase);
  if ((await EntryStorage.hasEncryptionKey()) !== encryption.getEncryptionStatus()) {
    console.warn("getTotp() => encryption status mismatch");
    return Error("Encryption status mismatch");
  }

  await EntryStorage.import(encryption, entryData);
  return entryData[hash];
}

// console.log("background loaded");
