import { sendMessageToBackground } from "@src/chrome/message";

export function captureQR() {
  sendMessageToBackground({
    message: { type: "captureQR", data: null },
  });
}