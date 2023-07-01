import { t } from "@src/chrome/i18n";
import { sendMessageToClient } from "@src/chrome/message";
import { Encryption } from "@src/models/encryption";
// import { getOTPAuthPerLineFromOPTAuthMigration } from "@src/models/migration";
import { EntryStorage } from "@src/models/storage";
import uuid from "uuid/v4";
import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss");

const cachedPassphrase = "";

chrome.runtime.onConnect.addListener((port) => {
  port.onDisconnect.addListener(() => {
    console.log("Port disconnected");
  });
  port.onMessage.addListener(async (message: Message) => {
    console.log("onMessage() => type:", message.type, "- data:", JSON.stringify(message.data));
    try {
      switch (message.type) {
        case "captureQR":
          await chrome.tabs.query({ active: true, lastFocusedWindow: true }).then(async (tab) => {
            if (!tab?.[0]?.id) {
              console.warn("captureQR: No active tab found");
              return;
            }
            await chrome.scripting.executeScript({
              target: { tabId: tab?.[0].id, allFrames: true },
              files: ["/src/pages/capture/index.js"],
            });
            await chrome.scripting.insertCSS({
              files: ["/assets/css/contentCapture.chunk.css"],
              target: { tabId: tab?.[0].id },
            });
            await chrome.tabs.sendMessage(tab?.[0].id, { type: "capture" });
            sendMessageToClient(port, {
              type: message.type,
              data: "received",
            });
          });
          break;
        case "getCapture":
          await chrome.tabs.query({ active: true, lastFocusedWindow: true }).then(async (tab) => {
            if (!tab?.[0]?.id) {
              console.warn("getCapture: No active tab found");
              return;
            }
            const url = await getCapture(tab?.[0]);
            const messagge = { type: "sendCaptureUrl", data: { ...message.data, url } };
            chrome.tabs.sendMessage(tab?.[0]?.id, messagge);
          });
          break;
        case "getTotp":
          {
            const entry = await getTotp(message.data);
            sendMessageToClient(port, {
              type: "getTotp",
              data: entry,
            });
          }
          break;
        default:
          console.warn("Unknown message type", message.type);
      }
    } catch (error) {
      console.warn(error);
    }
  });
});

async function getCapture(tab: chrome.tabs.Tab) {
  const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" });
  return dataUrl;
}

async function getTotp(message: { url: string; site: string }) {
  const { url, site } = message;
  const regexTotp = /^otpauth:\/\/totp\/.*[?&]secret=/;

  if (!regexTotp.test(url)) {
    console.warn("getTotp() => bad url", url);
    return false;
  }

  const hash = await uuid();
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
      return false;
    }
  }

  if (!entryData[hash].secret) {
    console.warn("getTotp() => no secret", url);
    return false;
  }

  // If the entries are encrypted and we aren't unlocked, error.
  const encryption = new Encryption(cachedPassphrase);
  if ((await EntryStorage.hasEncryptionKey()) !== encryption.getEncryptionStatus()) {
    console.warn("getTotp() => encryption status mismatch");
    return false;
  }

  await EntryStorage.import(encryption, entryData);
  return entryData[hash];
}

console.log("background loaded");
