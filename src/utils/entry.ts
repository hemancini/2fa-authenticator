import type { OTPEntry as OTPEntryLegacy } from "../models/legacy/otp";
import { OTPEntry } from "../otp/entry";
import type { OTPEntry as OTPEntryType, OTPPeriod, OTPType } from "../otp/type";

interface OtpAuth {
  type: string;
  label: string;
  params: Record<string, string>;
}

export function decomposeOtpAuthUrl(url: string) {
  if (!url) {
    throw new Error("La URL es requerida.");
  }

  const replaceIssuer = true;
  const modifiedUrl = replaceIssuer ? url.replace(/(?<=\/)[^/]+:/, "") : url;
  const parsedUrl = new URL(modifiedUrl);

  if (parsedUrl.protocol !== "otpauth:") {
    throw new Error("La URL no es una URL otpauth válida.");
  }

  const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);
  if (pathSegments.length < 2) {
    throw new Error("La URL otpauth no tiene el formato esperado.");
  }

  const [type, ...resto] = pathSegments;
  const label = resto.join("/");

  const otpauth: OtpAuth = { type, label, params: {} };

  if (parsedUrl.search) {
    const params = new URLSearchParams(parsedUrl.search);
    params.forEach((value, key) => {
      otpauth.params[key] = value;
    });
  }

  return otpauth;
}

export function newEntryFromUrl(url: string): OTPEntry {
  const regexTotp = /^otpauth:\/\/totp\/.*[?&]secret=/;
  if (!regexTotp.test(url)) {
    throw new Error("La URL no es una URL otpauth válida.");
  }

  const decompose = decomposeOtpAuthUrl(url);
  const {
    type,
    label: email,
    params: { secret, issuer, period = 30 },
  } = decompose;

  const { digits = 6, algorithm = "SHA1" } = {};
  // period: (Math.floor(Math.random() * (39 - 10 + 1)) + 10) as OTPPeriod,

  const newEntry = new OTPEntry({
    issuer: issuer,
    account: email,
    secret: secret,
    period: period as OTPPeriod,
    type: type as OTPType,
    digits: digits,
    algorithm: algorithm,
    site: "",
  });

  return newEntry;
}

export const migrateV1ToV2 = (entries: OTPEntryLegacy[]) => {
  if (entries.length === 0) return new Map<string, OTPEntry>();
  return new Map(
    [...entries.values()].map((entry) => {
      {
        delete entry.code;
        delete entry.index;
        delete entry.pinned;
        delete entry.counter;
        delete entry.encSecret;
        return [
          entry.hash,
          {
            ...entry,
            type: entry.type === 1 ? "totp" : "hotp",
            algorithm: entry.algorithm === 1 ? "SHA1" : "SHA256",
          } as OTPEntryType,
        ];
      }
    })
  );
};
