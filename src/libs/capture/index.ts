import scanGIF from "@assets/img/scan.gif";
import { t } from "@src/chrome/i18n";
import { sendMessageToBackground } from "@src/chrome/message";
import { addFromBackground, newEntryFromUrl } from "@src/utils/entry";
import jsQR from "jsqr";

type MessageData = {
  captureBoxLeft: number;
  captureBoxTop: number;
  captureBoxWidth: number;
  captureBoxHeight: number;
};

if (!document.getElementById("__ga_grayLayout__")) {
  chrome.runtime.onMessage.addListener((message: Message) => {
    switch (message.type) {
      case "capture":
        showGrayLayout();
        break;
      default:
        console.warn("capture.ts: Unknown message type", message.type);
        break;
    }
  });
}

sessionStorage.setItem("captureBoxPositionLeft", "0");
sessionStorage.setItem("captureBoxPositionTop", "0");

function showGrayLayout() {
  let grayLayout = document.getElementById("__ga_grayLayout__");
  let qrCanvas = document.getElementById("__ga_qrCanvas__");
  if (!grayLayout) {
    qrCanvas = document.createElement("canvas");
    qrCanvas.id = "__ga_qrCanvas__";
    qrCanvas.style.display = "none";
    document.body.appendChild(qrCanvas);
    grayLayout = document.createElement("div");
    grayLayout.id = "__ga_grayLayout__";
    document.body.appendChild(grayLayout);
    const scan = document.createElement("div");
    scan.className = "scan";
    scan.id = "__ga_scan__";
    scan.style.background = `url('${scanGIF}') no-repeat center`;
    grayLayout.appendChild(scan);
    const captureBox = document.createElement("div");
    captureBox.id = "__ga_captureBox__";
    grayLayout.appendChild(captureBox);
    grayLayout.onmousedown = grayLayoutDown;
    grayLayout.onmousemove = grayLayoutMove;
    grayLayout.onmouseup = (event) => {
      grayLayoutUp(event);
    };
    grayLayout.oncontextmenu = (event) => {
      event.preventDefault();
      return;
    };
  }
  grayLayout.style.display = "block";
}

function grayLayoutDown(event: MouseEvent) {
  if (event.button === 1 || event.button === 2) {
    event.preventDefault();
    return;
  }
  const captureBox = document.getElementById("__ga_captureBox__");
  if (!captureBox) {
    return;
  }

  sessionStorage.setItem("captureBoxPositionLeft", event.clientX.toString());
  sessionStorage.setItem("captureBoxPositionTop", event.clientY.toString());

  captureBox.style.left = event.clientX + "px";
  captureBox.style.top = event.clientY + "px";
  captureBox.style.width = "1px";
  captureBox.style.height = "1px";
  captureBox.style.display = "block";

  const scan = document.getElementById("__ga_scan__");
  if (scan) {
    scan.style.background = "transparent";
  }
  return;
}

function grayLayoutMove(event: MouseEvent) {
  if (event.button === 1 || event.button === 2) {
    event.preventDefault();
    return;
  }
  const captureBox = document.getElementById("__ga_captureBox__");
  if (!captureBox) {
    return;
  }

  const captureBoxLeft = Math.min(Number(sessionStorage.getItem("captureBoxPositionLeft")), event.clientX);
  const captureBoxTop = Math.min(Number(sessionStorage.getItem("captureBoxPositionTop")), event.clientY);
  const captureBoxWidth = Math.abs(Number(sessionStorage.getItem("captureBoxPositionLeft")) - event.clientX) - 1;
  const captureBoxHeight = Math.abs(Number(sessionStorage.getItem("captureBoxPositionTop")) - event.clientY) - 1;

  captureBox.style.left = captureBoxLeft + "px";
  captureBox.style.top = captureBoxTop + "px";
  captureBox.style.width = captureBoxWidth + "px";
  captureBox.style.height = captureBoxHeight + "px";
  return;
}

function grayLayoutUp(event: MouseEvent) {
  const grayLayout = document.getElementById("__ga_grayLayout__");
  const captureBox = document.getElementById("__ga_captureBox__");
  if (!captureBox || !grayLayout) {
    return;
  }

  setTimeout(() => {
    captureBox.style.display = "none";
    grayLayout.style.display = "none";
  }, 100);

  if (event.button === 1 || event.button === 2) {
    event.preventDefault();
    return;
  }

  const captureBoxLeft = Math.min(Number(sessionStorage.getItem("captureBoxPositionLeft")), event.clientX) + 1;
  const captureBoxTop = Math.min(Number(sessionStorage.getItem("captureBoxPositionTop")), event.clientY) + 1;
  const captureBoxWidth = Math.abs(Number(sessionStorage.getItem("captureBoxPositionLeft")) - event.clientX) - 1;
  const captureBoxHeight = Math.abs(Number(sessionStorage.getItem("captureBoxPositionTop")) - event.clientY) - 1;

  // make sure captureBox and grayLayout is hidden
  setTimeout(() => {
    return new Promise((resolve, reject) => {
      sendMessageToBackground({
        message: {
          type: "getCapture",
          data: {
            captureBoxLeft,
            captureBoxTop,
            captureBoxWidth,
            captureBoxHeight,
          },
        },
        handleSuccess: (data: MessageData & { url: string }) => {
          qrDecode(data?.url, data.captureBoxLeft, data.captureBoxTop, data.captureBoxWidth, data.captureBoxHeight);
          resolve(data);
        },
        handleError: (error: Error) => {
          reject(error);
          console.log(error.name + " - " + error.message);
        },
      });
    });
  }, 200);
  return false;
}

async function qrDecode(url: string, left: number, top: number, width: number, height: number) {
  const canvas = document.getElementById("__ga_qrCanvas__") as HTMLCanvasElement;
  const qr = new Image();

  qr.onload = () => {
    const devicePixelRatio = qr.width / window.innerWidth;
    canvas.width = qr.width;
    canvas.height = qr.height;
    canvas.getContext("2d")?.drawImage(qr, 0, 0);

    const imageData = canvas
      .getContext("2d")
      ?.getImageData(
        left * devicePixelRatio,
        top * devicePixelRatio,
        width * devicePixelRatio,
        height * devicePixelRatio
      );

    if (imageData) {
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      canvas.getContext("2d")?.putImageData(imageData, 0, 0);

      const jsQrCode = jsQR(imageData.data, imageData.width, imageData.height);
      if (!jsQrCode?.data) {
        alert(t("qrCodeNotFound"));
        return;
      }

      const qrData = jsQrCode.data;
      // console.log("qrData:", qrData);

      return new Promise((resolve, reject) => {
        const entry = newEntryFromUrl(qrData);
        addFromBackground(entry)
          .then(() => {
            const alertResp = t("addAccountSuccess", entry.account);
            resolve(entry);
            alert(alertResp);
          })
          .catch((error) => {
            reject(error);
            alert(error.name + " - " + error.message);
          });
      });
    }
  };

  qr.src = url;
}

window.onkeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    event.preventDefault();
    const grayLayout = document.getElementById("__ga_grayLayout__");
    const captureBox = document.getElementById("__ga_captureBox__");

    if (grayLayout) {
      grayLayout.style.display = "none";
    }
    if (captureBox) {
      captureBox.style.display = "none";
    }
  }
};
