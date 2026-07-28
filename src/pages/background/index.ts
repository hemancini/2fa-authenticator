import { sendErrorMessageToClient, sendMessageToClient } from "@src/chrome/message";
import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

import manifest from "../../../manifest";

reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss");

const entrustSamlPath = "/#/saml/authentication/";
const { VITE_GOOGLE_REDIRECT_URI: GOOGLE_REDIRECT_URI } = import.meta.env;

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(async (message: Message) => {
    try {
      const { type, data } = message;
      switch (type) {
        case "captureQR":
          await captureQR();
          sendMessageToClient(port, { type, data: "received" });
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
        case "autofill":
          await autofill(data);
          break;
        case "oauth":
          await oauthLogin(port);
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

/**
 * Injects the autofill script in the active tab and sends it the code.
 *
 * The host permission is only requested as a last resort: when the popup is opened
 * from the extension action, `activeTab` already grants temporary access to the
 * active tab, so the injection succeeds without prompting the user.
 */
async function autofill(data: Message["data"]) {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (!tab?.id) {
    console.warn("autofill: No active tab found");
    throw new Error("No active tab found");
  }

  const pasteCode = async () => {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id as number, allFrames: true },
      files: ["/src/libs/autofill/index.js"],
    });
    await chrome.tabs.sendMessage(tab.id as number, { message: "pastecode", data });
  };

  try {
    // Works when the host permission was already granted or when `activeTab`
    // covers the tab the user was on when the popup was opened
    await pasteCode();
    return;
  } catch (error) {
    console.warn("autofill: injection failed, requesting host permission", error);
  }

  const origin = getOriginMatchPattern(tab.url);
  if (!origin) throw new Error("Invalid tab url");

  const granted = await chrome.permissions.request({ origins: [origin] });
  if (!granted) {
    console.warn("autofill: Granted permission denied");
    throw new Error("Granted permission denied");
  }
  await pasteCode();
}

/** `https://github.com/some/path` -> `https://github.com/*` */
function getOriginMatchPattern(url?: string) {
  if (!url) return undefined;
  try {
    const { origin, protocol } = new URL(url);
    if (!["http:", "https:"].includes(protocol)) return undefined;
    return `${origin}/*`;
  } catch {
    return undefined;
  }
}

async function getCapture(tab: chrome.tabs.Tab) {
  const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" });
  return dataUrl;
}

async function oauthLogin(port: chrome.runtime.Port) {
  const onUpdated = async (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
    if (changeInfo.status === "complete") {
      const url = tab?.url;
      if (!url) return;

      const onClose = async (tabIdR: number) => {
        if (tabId === tabIdR) {
          const error = new Error("Tab closed");
          sendErrorMessageToClient(port, error);
          // remove the listeners
          chrome.tabs.onRemoved.removeListener(onClose);
          chrome.tabs.onUpdated.removeListener(onUpdated);
          return;
        }
      };
      // Add listener to check if the tab is closed
      chrome.tabs.onRemoved.addListener(onClose);

      // auth token from google
      if (url.startsWith(GOOGLE_REDIRECT_URI)) {
        const urlParams = new URLSearchParams(url);
        const token = urlParams.get("access_token");

        sendMessageToClient(port, { type: "oauth", data: token });
        setTimeout(() => chrome.tabs.remove(tabId), 500); // close the tab

        // remove the listener
        chrome.tabs.onRemoved.removeListener(onClose);
        chrome.tabs.onUpdated.removeListener(onUpdated);
        return;
      }
    }
  };
  // Add listener to check the url
  chrome.tabs.onUpdated.addListener(onUpdated);
}
