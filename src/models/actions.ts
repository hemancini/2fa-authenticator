import { sendMessageToBackground } from "@src/chrome/message";

interface GetCapture {
  type: "getCapture";
  data: {
    url?: string;
    captureBoxLeft: number;
    captureBoxTop: number;
    captureBoxWidth: number;
    captureBoxHeight: number;
  };
}

interface GetTotp {
  type: "getTotp";
  data: string;
}

export function captureQR() {
  return new Promise((resolve) => {
    sendMessageToBackground({
      message: { type: "captureQR", data: null },
      handleSuccess: (result) => {
        if (result === "received") {
          window.close();
          resolve(result);
        }
      },
    });
  });
}

export function getCapture(message: GetCapture) {
  return new Promise((resolve) => {
    sendMessageToBackground({
      message,
      handleSuccess: (result) => {
        if (result === "received") {
          resolve(result);
        }
      },
    });
  });
}

export function getTotp(message: GetTotp) {
  return new Promise((resolve) => {
    sendMessageToBackground({
      message,
      handleSuccess: (result) => {
        if (result === "received") {
          resolve(result);
        }
      },
    });
  });
}
