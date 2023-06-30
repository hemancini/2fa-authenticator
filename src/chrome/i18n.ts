import type EnMessage from "../../public/_locales/en/messages.json";
import type EsMessage from "../../public/_locales/es/messages.json";

type MessageKey = typeof EsMessage | typeof EnMessage;

export function t(messageNameKey: keyof MessageKey, substitutions?: string | string[]) {
  return chrome.i18n.getMessage(messageNameKey, substitutions);
}
