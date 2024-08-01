import { remove } from "@src/chrome/localStorage";
import { OTPEntry } from "@src/entry/otp";
import type { EntryState, OTPDigits, OTPEntry as TOTPEntry, OTPEntryLegacy, OTPPeriod, OTPType } from "@src/entry/type";
import { decrypt, encrypt } from "@src/utils/crypto";
import superjson from "superjson";
import type { StorageValue } from "zustand/middleware";

interface OtpAuth {
  type: string;
  label: string;
  params: Record<string, string>;
}

const isEncrypted = !(import.meta.env.VITE_DATA_ENCRYPTED === "false");

export function newEntryFromUrl(url: string): TOTPEntry {
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
  });

  return newEntry;
}

export async function getRandomEntry(): Promise<OTPEntry> {
  const response = await fetch("https://randomuser.me/api/");
  const data = await response.json();
  const user = data?.results?.[0];
  if (!user) return;

  const {
    email,
    login: { uuid, username },
  } = user;
  const newEntry = new OTPEntry({
    issuer: username,
    account: email,
    secret: uuid,
    period: (Math.floor(Math.random() * (39 - 10 + 1)) + 10) as OTPPeriod,
    type: "totp",
    digits: 6,
    algorithm: "SHA1",
  });

  return newEntry;
}

export const getBackgroundEntries = async () => {
  const entriesStorage = await chrome.storage[CHROME_STORAGE_AREA].get([STORAGE_ENTRIES_KEY]);
  if (entriesStorage) {
    const data = entriesStorage[STORAGE_ENTRIES_KEY];
    const entriesStorageParse = superjson.parse(isEncrypted ? decrypt(data) : data) as StorageValue<EntryState>;
    return entriesStorageParse.state.entries;
  }
  return new Map<string, TOTPEntry>();
};

export async function addFromBackground(entry: TOTPEntry) {
  const entriesStorage = await chrome.storage[CHROME_STORAGE_AREA].get([STORAGE_ENTRIES_KEY]);
  if (entriesStorage) {
    const data = entriesStorage[STORAGE_ENTRIES_KEY];
    const entriesStorageParse = superjson.parse(isEncrypted ? decrypt(data) : data) as StorageValue<EntryState>;
    entriesStorageParse.state.entries = new Map([[entry.hash, entry], ...entriesStorageParse.state.entries]);
    const entriesStringified = superjson.stringify(entriesStorageParse);
    await chrome.storage[CHROME_STORAGE_AREA].set({
      [STORAGE_ENTRIES_KEY]: isEncrypted ? encrypt(entriesStringified) : entriesStringified,
    });
  } else {
    const draftParse = superjson.parse(JSON.stringify(draftStorage)) as StorageValue<EntryState>;
    draftParse.state.entries = new Map([[entry.hash, entry]]);
    const draftStringified = superjson.stringify(draftParse);
    await chrome.storage[CHROME_STORAGE_AREA].set({
      [STORAGE_ENTRIES_KEY]: isEncrypted ? encrypt(draftStringified) : draftStringified,
    });
  }
}

function decomposeOtpAuthUrl(url: string) {
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

const draftStorage = {
  json: {
    state: {
      entries: [],
    },
    version: 0,
  },
  meta: {
    values: {
      "state.entries": ["map"],
    },
  },
};

/**
 * @deprecated since version 1.3.0
 */
export const migrateLegacy = async () => {
  console.log("Migrating legacy entries");
  const legacyEntries = await getLegacyEntries();
  if (legacyEntries.length === 0) return new Map<string, TOTPEntry>();

  const entries = new Map(
    [...(legacyEntries?.values() ?? [])].map((entryLegacy) => {
      {
        const { issuer, account, secret, counter: period = 30, digits = 6 } = entryLegacy;

        const newEntry = new OTPEntry({
          issuer: issuer,
          account: account,
          secret: secret,
          period: period as OTPPeriod,
          digits: digits as OTPDigits,
          type: (entryLegacy.type === 1 || entryLegacy.type === ("totp" as unknown) ? "totp" : "hotp") as OTPType,
          algorithm: entryLegacy.algorithm === 1 || entryLegacy.algorithm === ("SHA1" as unknown) ? "SHA1" : "SHA256",
        });

        return [newEntry.hash, newEntry];
      }
    })
  );

  return entries;
};

/**
 * @deprecated since version 1.3.0
 */
export async function clearLegacyEntries() {
  const entriesLegacy = await getLegacyEntries();
  if (entriesLegacy.length === 0) return;

  for (const entry of entriesLegacy) {
    console.log("Removing legacy entry", entry.account);
    await remove(entry.hash);
  }
}

/**
 * @deprecated since version 1.3.0
 */
async function getLegacyEntries() {
  const entries: OTPEntryLegacy[] = [];
  const storage = await chrome.storage.sync.get();
  for (const key of Object.keys(storage)) {
    const entry = storage[key];
    if (entry && entry.hash && entry.secret) {
      entries.push(entry);
    }
  }
  return entries;
}
