chrome.runtime.onMessage.addListener(async (request) => {
  if (request.message === "pastecode") {
    const { code } = request.data;
    const autofillEnabled = await chrome.storage.local
      .get(["OPTIONS"])
      .then((result) => result.OPTIONS?.autofillEnabled);
    if (autofillEnabled) {
      pasteCode(code);
    }
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
    return;
  }
  const identities = ["2fa", "otp", "authenticator", "factor", "code", "totp", "twoFactorCode"];
  for (const inputBox of inputBoxes) {
    for (const identity of identities) {
      if (inputBox.name.toLowerCase().indexOf(identity) >= 0 || inputBox.id.toLowerCase().indexOf(identity) >= 0) {
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
