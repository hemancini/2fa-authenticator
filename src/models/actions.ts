import { sendMessageToBackground } from "@src/chrome/message";

export function captureQR() {
  return new Promise((resolve) => {
    sendMessageToBackground({
      message: { type: "captureQR", data: null },
      handleSuccess: (result) => {
        if (result === "OK") {
          window.close();
          resolve(result);
        }
      },
    });
  });
}
