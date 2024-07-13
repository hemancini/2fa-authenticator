import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";

const { HASH_KEY = "MY_SUPER_SECRET_KEY" } = import.meta.env;

function fingerprint() {
  return HASH_KEY;
}

export function encrypt(value: string) {
  const secureKey = fingerprint();
  return AES.encrypt(value, secureKey).toString();
}

export function decrypt(value: string) {
  try {
    const secureKey = fingerprint();
    const bytes = AES.decrypt(value, secureKey);
    return bytes.toString(Utf8) || "";
  } catch (ex) {
    return "";
  }
}
