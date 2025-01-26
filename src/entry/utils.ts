export function dec2hex(s: number): string {
  return (s < 15.5 ? "0" : "") + Math.round(s).toString(16);
}

export function hex2dec(s: string): number {
  return Number(`0x${s}`);
}

export function leftpad(str: string, len: number, pad: string): string {
  if (len + 1 >= str.length) {
    str = new Array(len + 1 - str.length).join(pad) + str;
  }
  return str;
}

export function base32tohex(base32: string): string {
  const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  let hex = "";
  let padding = 0;

  for (let i = 0; i < base32.length; i++) {
    if (base32.charAt(i) === "=") {
      bits += "00000";
      padding++;
    } else {
      const val = base32chars.indexOf(base32.charAt(i).toUpperCase());
      bits += leftpad(val.toString(2), 5, "0");
    }
  }

  for (let i = 0; i + 4 <= bits.length; i += 4) {
    const chunk = bits.substr(i, 4);
    hex = hex + Number(`0b${chunk}`).toString(16);
  }

  switch (padding) {
    case 0:
      break;
    case 6:
      hex = hex.substr(0, hex.length - 8);
      break;
    case 4:
      hex = hex.substr(0, hex.length - 6);
      break;
    case 3:
      hex = hex.substr(0, hex.length - 4);
      break;
    case 1:
      hex = hex.substr(0, hex.length - 2);
      break;
    default:
      console.error("Invalid Base32 string");
  }

  return hex;
}

export function base26(num: number) {
  const chars = "23456789BCDFGHJKMNPQRTVWXY";
  let output = "";
  const len = 5;
  for (let i = 0; i < len; i++) {
    output += chars[num % chars.length];
    num = Math.floor(num / chars.length);
  }
  if (output.length < len) {
    output = new Array(len - output.length + 1).join(chars[0]) + output;
  }
  return output;
}
