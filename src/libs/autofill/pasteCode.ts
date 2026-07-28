const FILLABLE_TYPES = ["text", "number", "tel", "password", "search"];

/** Strong signals: the field is almost certainly the verification code */
const STRONG_HINTS = [
  /one[-_\s]?time[-_\s]?(code|password)/i,
  /\botp\b/i,
  /\btotp\b/i,
  /\bmfa\b/i,
  /2fa|two[-_\s]?factor|second[-_\s]?factor/i,
  /(auth|authentication|verification|verify|security|confirmation|sms|email|login)[-_\s]?code/i,
  /codigo[-_\s]?(de[-_\s]?)?(verificacion|seguridad|autenticacion|confirmacion)/i,
  /authenticator|passcode|token/i,
];

/** Weak signals: worth filling only when nothing better shows up */
const WEAK_HINTS = [/\bcode\b|codigo/i, /\bpin\b/i, /digit|digito/i, /verif/i];

/** Fields that look like a code but are not the one we want */
const NEGATIVE_HINTS = [
  /promo|coupon|discount|voucher|gift/i,
  /zip|postal|country|area|dial|prefix/i,
  /referral|invite|affiliate/i,
  /search|query/i,
  /user|email|phone|mobile|address|card|cvv|cvc|expiry/i,
];

export function pasteCode(code: string) {
  if (!code) return;

  const inputBoxes = collectInputs(document).filter(isFillable);
  if (!inputBoxes.length) {
    console.log("No input boxes found");
    return;
  }

  // Split inputs (one box per digit) are handled apart: they need one value per box
  const segmented = getSegmentedInputs(inputBoxes, code.length);
  if (segmented) {
    segmented.forEach((inputBox, index) => fillInput(inputBox, code[index]));
    return;
  }

  const scored = inputBoxes
    .map((inputBox) => ({ inputBox, score: scoreInput(inputBox, code) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  const bestMatch = scored[0];
  if (bestMatch) {
    fillInput(bestMatch.inputBox, code);
    return;
  }

  const activeInputBox = inputBoxes.find((inputBox) => inputBox === document.activeElement);
  if (activeInputBox && isOverwritable(activeInputBox, code)) {
    fillInput(activeInputBox, code);
    return;
  }

  // Last resort: the first plain field that is not meant for something else
  const firstEmpty = inputBoxes.find(
    (inputBox) =>
      inputBox.type !== "password" &&
      isVisible(inputBox) &&
      isOverwritable(inputBox, code) &&
      !NEGATIVE_HINTS.some((hint) => hint.test(getHintText(inputBox)))
  );
  if (firstEmpty) fillInput(firstEmpty, code);
}

/** Collects inputs of the document, including the ones inside open shadow roots */
function collectInputs(root: Document | ShadowRoot): HTMLInputElement[] {
  const inputBoxes = Array.from(root.querySelectorAll("input"));
  root.querySelectorAll("*").forEach((element) => {
    if (element.shadowRoot) inputBoxes.push(...collectInputs(element.shadowRoot));
  });
  return inputBoxes;
}

function isFillable(inputBox: HTMLInputElement) {
  if (inputBox.disabled || inputBox.readOnly) return false;
  // `type` is normalized by the browser, an unknown/missing type reads as "text"
  return FILLABLE_TYPES.includes(inputBox.type);
}

function isVisible(inputBox: HTMLInputElement) {
  if (inputBox.hidden) return false;
  const { width, height } = inputBox.getBoundingClientRect();
  if (!width && !height) return false;
  const { display, visibility } = getComputedStyle(inputBox);
  return display !== "none" && visibility !== "hidden";
}

/** Keeps the original safety net: never replace something the user typed */
function isOverwritable(inputBox: HTMLInputElement, code: string) {
  const { value } = inputBox;
  return !value || value === code || new RegExp(`^\\d{${code.length}}$`).test(value);
}

/** Every attribute that may describe the purpose of the field */
function getHintText(inputBox: HTMLInputElement) {
  const labels = Array.from(inputBox.labels || []).map((label) => label.textContent);
  return [
    inputBox.name,
    inputBox.id,
    inputBox.placeholder,
    inputBox.title,
    inputBox.className,
    inputBox.getAttribute("aria-label"),
    inputBox.getAttribute("aria-labelledby"),
    inputBox.getAttribute("data-testid"),
    inputBox.getAttribute("autocomplete"),
    ...labels,
  ]
    .filter(Boolean)
    .join(" ");
}

function scoreInput(inputBox: HTMLInputElement, code: string) {
  if (!isOverwritable(inputBox, code)) return 0;

  const hintText = getHintText(inputBox);
  const autocomplete = inputBox.getAttribute("autocomplete") || "";
  const isOneTimeCode = autocomplete.includes("one-time-code");
  const hasStrongHint = STRONG_HINTS.some((hint) => hint.test(hintText));

  // A `one-time-code` field is the standard signal, it is filled even when hidden
  if (!isOneTimeCode && !isVisible(inputBox)) return 0;
  // A strong hint wins over a negative one: `emailCode` is still a code
  if (!isOneTimeCode && !hasStrongHint && NEGATIVE_HINTS.some((hint) => hint.test(hintText))) return 0;

  let score = 0;
  if (isOneTimeCode) score += 100;
  if (hasStrongHint) score += 50;
  else if (WEAK_HINTS.some((hint) => hint.test(hintText))) score += 20;

  const { maxLength, inputMode, pattern } = inputBox;
  if (maxLength === code.length) score += 25;
  if (["numeric", "tel"].includes(inputMode) || /\[0-9\]|\\d/.test(pattern)) score += 10;
  if (inputBox === document.activeElement) score += 30;
  if (!inputBox.value) score += 10;
  if (inputBox.type === "password" && !isOneTimeCode) score -= 15;

  return score;
}

/** Detects the `_ _ _ _ _ _` layout: one single character box per digit */
function getSegmentedInputs(inputBoxes: HTMLInputElement[], length: number) {
  const boxes = inputBoxes.filter((inputBox) => inputBox.maxLength === 1 && isVisible(inputBox));
  if (boxes.length < length) return undefined;

  const segmented = boxes.slice(0, length);
  const isEmptyOrDigit = segmented.every((inputBox) => !inputBox.value || /^\d$/.test(inputBox.value));
  return isEmptyOrDigit ? segmented : undefined;
}

function fillInput(inputBox: HTMLInputElement, value: string) {
  inputBox.focus();
  setNativeValue(inputBox, value);
  fireInputEvents(inputBox, value);
}

/**
 * Frameworks such as React track the value with their own setter, assigning
 * `input.value` directly leaves their state out of sync. Calling the native
 * setter of the prototype makes the change visible to them.
 */
function setNativeValue(inputBox: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  if (setter) setter.call(inputBox, value);
  else inputBox.value = value;
}

function fireInputEvents(inputBox: HTMLInputElement, value: string) {
  const key = value.length === 1 ? value : undefined;
  const events = [
    new KeyboardEvent("keydown", { key, bubbles: true }),
    new KeyboardEvent("keypress", { key, bubbles: true }),
    new InputEvent("beforeinput", { data: value, inputType: "insertText", bubbles: true }),
    new InputEvent("input", { data: value, inputType: "insertText", bubbles: true }),
    new KeyboardEvent("keyup", { key, bubbles: true }),
    new Event("change", { bubbles: true }),
  ];
  for (const event of events) {
    inputBox.dispatchEvent(event);
  }
}
