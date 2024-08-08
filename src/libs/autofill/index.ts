import { getOptionsStorage } from "@src/utils/options";

chrome.runtime.onMessage.addListener(async (request) => {
  const { autofillEnabled } = await getOptionsStorage();
  if (autofillEnabled && request.message === "pastecode") {
    const { code } = request.data;
    pasteCode(code);
  }
});

function pasteCode(code: string) {
  const _inputBoxes = document.getElementsByTagName("input");
  const inputBoxes: HTMLInputElement[] = [];
  for (let i = 0; i < _inputBoxes.length; i++) {
    if (
      _inputBoxes[i].type === "text" ||
      _inputBoxes[i].type === "number" ||
      _inputBoxes[i].type === "tel" ||
      _inputBoxes[i].type === "password"
    ) {
      inputBoxes.push(_inputBoxes[i]);
    }
  }

  if (!inputBoxes.length) {
    console.log("No input boxes found");
    return;
  }

  const identities = ["mfaCode", "2fa", "otp", "authenticator", "factor", "code", "totp", "twoFactorCode"];
  for (const inputBox of inputBoxes) {
    for (const identity of identities) {
      const inputBoxName = inputBox.name.toLowerCase();
      const inputBoxId = inputBox.id.toLowerCase();
      if (inputBoxName.indexOf(identity) >= 0 || inputBoxId === identity) {
        if (!inputBox.value || /^(\d{6}|\d{8})$/.test(inputBox.value)) {
          inputBox.value = code;
          fireInputEvents(inputBox);
        }
        return;
      }
    }
  }

  const activeInputBox =
    document.activeElement && document.activeElement.tagName === "INPUT" ? document.activeElement : null;
  if (activeInputBox) {
    const inputBox = activeInputBox as HTMLInputElement;
    if (!inputBox.value || /^(\d{6}|\d{8})$/.test(inputBox.value)) {
      inputBox.value = code;
      fireInputEvents(inputBox);
    }
    return;
  }

  for (const inputBox of inputBoxes) {
    if ((!inputBox.value || /^(\d{6}|\d{8})$/.test(inputBox.value)) && inputBox.type !== "password") {
      inputBox.value = code;
      fireInputEvents(inputBox);
      return;
    }
  }
  return;
}

function fireInputEvents(inputBox: HTMLInputElement) {
  const events = [
    new KeyboardEvent("keydown"),
    new KeyboardEvent("keyup"),
    new KeyboardEvent("keypress"),
    new Event("input", { bubbles: true }),
    new Event("change", { bubbles: true }),
  ];
  for (const event of events) {
    inputBox.dispatchEvent(event);
  }
  return;
}
