import HexEncoder from "crypto-js/enc-hex";
import HmacSHA1 from "crypto-js/hmac-sha1";
import HmacSHA256 from "crypto-js/hmac-sha256";

import { base32tohex, dec2hex, hex2dec, leftpad } from "./utils";

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

export function generateOTP(entry: TEntry): string {
  const key = base32tohex(entry.secret);
  const epoch = Math.round(new Date().getTime() / 1000.0);
  const time = leftpad(dec2hex(Math.floor(epoch / entry.period)), 16, "0");
  const hmacAlgorithm = entry.algorithm === "SHA1" ? HmacSHA1 : HmacSHA256;
  const hmac = HexEncoder.stringify(hmacAlgorithm(HexEncoder.parse(time.toString()), HexEncoder.parse(key)));
  const offset = hex2dec(hmac.substring(hmac.length - 1));
  const otp = (hex2dec(hmac.slice(offset * 2, offset * 2 + 8)) & hex2dec("7fffffff")).toString();
  return otp.slice(otp.length - entry.digits).toString();
}
