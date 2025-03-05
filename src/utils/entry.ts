import { CHROME_STORAGE_AREA, STORAGE_ENTRIES_KEY } from "@src/config";
import { OTPEntry } from "@src/entry/otp";
import { decrypt, encrypt } from "@src/utils/crypto";
import superjson from "superjson";
import type { StorageValue } from "zustand/middleware";

const isEncrypted = !(import.meta.env.VITE_DATA_ENCRYPTED === "false");

export function newEntryFromUrl(url: string): OTPEntry {
  const regexTotp = /^otpauth:\/\/totp\/.*[?&]secret=/;
  if (!regexTotp.test(url)) {
    throw new Error("Invalid URI string format");
  }

  const decodedUrl = decodeURIComponent(url);
  const [{ issuer, account: email, secret, period, type }] = parseTOTPURI(decodedUrl);

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
    totpURI: decodedUrl,
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
    totpURI: "",
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
  return new Map<string, OTPEntry>();
};

export async function addFromBackground(entry: OTPEntry) {
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

function parseTOTPURI(uri: string) {
  const regex = /otpauth:\/\/totp\/([^:]+):([^?]+)\?([^&]+)&?([^&]+)?&?([^&]+)?&?([^&]+)?/;
  const match = uri.match(regex);

  if (!match) {
    throw new Error("Invalid TOTP URI");
  }

  const issuer = match[1];
  const account = match[2];
  const params = new URLSearchParams(uri.split("?")[1]);

  const secret = params.get("secret");
  const algorithm = params.get("algorithm") || "SHA1";
  const digits = params.get("digits") || 6;
  const period = params.get("period") || 30;

  return [
    {
      issuer,
      account,
      secret,
      period: parseInt(period.toString(), 10),
      type: "totp",
      algorithm,
      digits: parseInt(digits.toString(), 10),
    },
  ];
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

  let legacyEntries = await getLegacyEntries("local");
  if (legacyEntries.length === 0) {
    legacyEntries = await getLegacyEntries("sync");
    if (legacyEntries.length === 0) {
      return new Map<string, OTPEntry>();
    }
  }

  const entries = new Map(
    [...(legacyEntries?.values() ?? [])].map((entryLegacy) => {
      {
        const { issuer, account, secret, counter = 30, digits = 6 } = entryLegacy;

        const newEntry = new OTPEntry({
          issuer: issuer,
          account: account,
          secret: secret,
          period: counter as OTPPeriod,
          digits: digits as OTPDigits,
          type: (!entryLegacy.type || entryLegacy.type === 1 || entryLegacy.type === ("totp" as unknown)
            ? "totp"
            : "hotp") as OTPType,
          algorithm:
            !entryLegacy.algorithm || entryLegacy.algorithm === 1 || entryLegacy.algorithm === ("SHA1" as unknown)
              ? "SHA1"
              : "SHA256",
          totpURI: "",
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
async function getLegacyEntries(storageType: "local" | "sync" = "local"): Promise<OTPEntryLegacy[]> {
  const entries: OTPEntryLegacy[] = [];
  const storage = await chrome.storage[storageType].get();

  for (const key of Object.keys(storage)) {
    const entry = storage[key];
    if (entry && entry.hash && entry.secret) {
      entries.push(entry);
    }
  }
  return entries;
}

/**
 * @deprecated since version 1.3.0
 */
export const setMigrated = async (migrated: boolean) => {
  await chrome.storage.local.set({ migrated });
};

/**
 * @deprecated since version 1.3.0
 */
export const getIsMigrated = async () => {
  const { migrated } = await chrome.storage.local.get("migrated");
  return migrated;
};
