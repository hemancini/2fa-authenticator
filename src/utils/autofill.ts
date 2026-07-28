import { sendMessageToBackground } from "@src/chrome/message";

/**
 * Asks the background to paste the code into the active tab.
 * Must be triggered by a user gesture: the background may need to request the
 * host permission for the current site.
 */
export function sendAutofill(code: string) {
  if (!code) return;
  sendMessageToBackground({
    message: { type: "autofill", data: { code } },
    handleError: (error) => console.warn("autofill:", error),
  });
}
