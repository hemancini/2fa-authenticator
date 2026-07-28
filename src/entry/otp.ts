import { base32tohex, dec2hex, hex2dec, leftpad } from "./utils";

const SUBTLE_HASHES: Record<OTPAlgorithm, string> = {
  SHA1: "SHA-1",
  SHA256: "SHA-256",
  SHA512: "SHA-512",
};

export class OTPEntry implements TEntry {
  hash: string;
  issuer: string;
  account: string;
  secret: string;
  period: OTPPeriod;
  type: OTPType;
  digits: OTPDigits;
  algorithm: OTPAlgorithm;
  isVisible?: boolean;
  encrypted?: boolean;
  site: string;
  totpURI?: string;

  constructor({ issuer, account, secret, period, type, digits, algorithm, encrypted = false, totpURI }: TEntry) {
    this.issuer = issuer;
    this.account = account;
    this.secret = secret;
    this.period = period;
    this.type = type;
    this.digits = digits;
    this.algorithm = algorithm;
    this.encrypted = encrypted;
    this.hash = this.generateHash();
    this.site = window.location.hostname ?? "";
    this.totpURI = totpURI;

    if (!this.algorithm) this.algorithm = "SHA1";
    if (!this.period) this.period = 30;
    if (!this.digits) this.digits = 6;
  }

  private generateHash(): string {
    return crypto.randomUUID();
  }
}

function hexToBytes(hex: string): ArrayBuffer {
  const padded = hex.length % 2 ? `${hex}0` : hex;
  const buffer = new ArrayBuffer(padded.length / 2);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(padded.substring(i * 2, i * 2 + 2), 16);
  }
  return buffer;
}

function bytesToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacHex(algorithm: OTPAlgorithm, keyHex: string, messageHex: string): Promise<string> {
  const hash = SUBTLE_HASHES[algorithm] ?? SUBTLE_HASHES.SHA1;
  const key = await crypto.subtle.importKey("raw", hexToBytes(keyHex), { name: "HMAC", hash }, false, ["sign"]);
  return bytesToHex(await crypto.subtle.sign("HMAC", key, hexToBytes(messageHex)));
}

export async function generateOTP(entry: TEntry): Promise<string> {
  const key = base32tohex(entry.secret);
  const epoch = Math.round(new Date().getTime() / 1000.0);
  const time = leftpad(dec2hex(Math.floor(epoch / entry.period)), 16, "0");
  const hmac = await hmacHex(entry.algorithm, key, time);
  const offset = hex2dec(hmac.substring(hmac.length - 1));
  const otp = (hex2dec(hmac.slice(offset * 2, offset * 2 + 8)) & hex2dec("7fffffff")).toString();
  return otp.slice(otp.length - entry.digits).toString();
}
