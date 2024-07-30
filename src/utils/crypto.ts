import CryptoJS from "crypto-js";

const { HASH_KEY = "MY_SUPER_SECRET_KEY" } = import.meta.env;

function fingerprint() {
  return HASH_KEY;
}

export function encrypt(value: string) {
  const secureKey = fingerprint();
  return CryptoJS.AES.encrypt(value, secureKey).toString();
}

export function decrypt(value: string) {
  try {
    const secureKey = fingerprint();
    const bytes = CryptoJS.AES.decrypt(value, secureKey);
    return bytes.toString(CryptoJS.enc.Utf8) || "";
  } catch (ex) {
    return "";
  }
}

export const encrypData = (data: string) =>
  data && data !== "" ? CryptoJS.AES.encrypt(data, import.meta.env.VITE_APP_KEY || DEFAULT_APP_KEY).toString() : data;

export const decrypData = (data: string) =>
  data && data !== ""
    ? CryptoJS.AES.decrypt(data, import.meta.env.VITE_APP_KEY || DEFAULT_APP_KEY).toString(CryptoJS.enc.Utf8)
    : data;
