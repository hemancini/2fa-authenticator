/**
 * @jest-environment jsdom
 */

// jsdom has no layout, every element would look hidden without this
HTMLElement.prototype.getBoundingClientRect = function () {
  const isHidden = this.style.display === "none" || this.hidden;
  return { width: isHidden ? 0 : 100, height: isHidden ? 0 : 20 } as DOMRect;
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { pasteCode } = require("./pasteCode");

const CODE = "583517";

const render = (html: string) => {
  document.body.innerHTML = html;
  return Array.from(document.querySelectorAll("input"));
};

describe("pasteCode", () => {
  it("fills the field flagged as one-time-code", () => {
    const [user, otp] = render(`
      <input name="username" />
      <input autocomplete="one-time-code" name="whatever" />
    `);
    pasteCode(CODE);
    expect(otp.value).toBe(CODE);
    expect(user.value).toBe("");
  });

  it("fills fields named after a verification code", () => {
    const [, code] = render(`
      <input type="text" name="username" />
      <input type="tel" name="verificationCode" />
    `);
    pasteCode(CODE);
    expect(code.value).toBe(CODE);
  });

  it("matches by placeholder, aria-label and label text", () => {
    const [byPlaceholder] = render(`<input placeholder="Código de verificación" />`);
    pasteCode(CODE);
    expect(byPlaceholder.value).toBe(CODE);

    const [byAria] = render(`<input aria-label="Authentication code" />`);
    pasteCode(CODE);
    expect(byAria.value).toBe(CODE);

    const [byLabel] = render(`<label for="x">Enter your OTP</label><input id="x" />`);
    pasteCode(CODE);
    expect(byLabel.value).toBe(CODE);
  });

  it("fills one digit per box on segmented inputs", () => {
    const boxes = render(
      Array.from({ length: 6 })
        .map(() => `<div><input maxlength="1" inputmode="numeric" /></div>`)
        .join("")
    );
    pasteCode(CODE);
    expect(boxes.map((box) => box.value).join("")).toBe(CODE);
  });

  it("ignores unrelated code fields", () => {
    const [promo, zip] = render(`
      <input name="promoCode" />
      <input name="zipcode" />
    `);
    pasteCode(CODE);
    expect(promo.value).toBe("");
    expect(zip.value).toBe("");
  });

  it("prefers a code field over a negative hint in the same name", () => {
    const [email, emailCode] = render(`
      <input name="email" type="text" />
      <input name="emailCode" type="text" />
    `);
    pasteCode(CODE);
    expect(emailCode.value).toBe(CODE);
    expect(email.value).toBe("");
  });

  it("does not overwrite what the user typed", () => {
    const [otp] = render(`<input name="otp" value="hello" />`);
    pasteCode(CODE);
    expect(otp.value).toBe("hello");
  });

  it("replaces a previous code", () => {
    const [otp] = render(`<input name="otp" value="111111" />`);
    pasteCode(CODE);
    expect(otp.value).toBe(CODE);
  });

  it("skips hidden and disabled fields", () => {
    const [hidden, disabled, visible] = render(`
      <input name="otp" style="display: none" />
      <input name="otp" disabled />
      <input name="otp" />
    `);
    pasteCode(CODE);
    expect(hidden.value).toBe("");
    expect(disabled.value).toBe("");
    expect(visible.value).toBe(CODE);
  });

  it("reaches inputs inside an open shadow root", () => {
    render(`<div id="host"></div>`);
    const shadow = document.getElementById("host")?.attachShadow({ mode: "open" }) as ShadowRoot;
    shadow.innerHTML = `<input name="otp" />`;
    const otp = shadow.querySelector("input") as HTMLInputElement;
    pasteCode(CODE);
    expect(otp.value).toBe(CODE);
  });

  it("notifies the page with bubbling input and change events", () => {
    render(`<input name="otp" />`);
    const events: string[] = [];
    ["keydown", "beforeinput", "input", "change"].forEach((type) =>
      document.addEventListener(type, (event) => events.push(event.type))
    );
    pasteCode(CODE);
    expect(events).toEqual(["keydown", "beforeinput", "input", "change"]);
  });

  it("falls back to the focused field", () => {
    const [, second] = render(`<input name="a" /><input name="b" />`);
    second.focus();
    pasteCode(CODE);
    expect(second.value).toBe(CODE);
  });

  it("does nothing without inputs", () => {
    render(`<div>no inputs here</div>`);
    expect(() => pasteCode(CODE)).not.toThrow();
  });
});
