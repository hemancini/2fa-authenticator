import type { OTPEntry as OTPEntryLegacy } from "@src/legacy/models/otp";
import { OTPEntry } from "@src/otp/entry";
import type { EntryState, OTPEntry as TOTPEntry, OTPPeriod, OTPType } from "@src/otp/type";
import superjson from "superjson";
import type { StorageValue } from "zustand/middleware";

interface OtpAuth {
  type: string;
  label: string;
  params: Record<string, string>;
}

const { ENTRIES_STOTAGE_KEY = "entries-v2" } = import.meta.env;

/**
 * @deprecated since version 1.3.0
 */
const getLegacyEntries = async () => {
  const entries: OTPEntryLegacy[] = [];
  const storage = await chrome.storage.local.get();
  delete storage["LocalStorage"];
  delete storage["2fa-options"];
  delete storage["entries-v2"];
  delete storage["OPTIONS"];

  for (const key of Object.keys(storage)) {
    const entry = storage[key];
    if (entry && entry.hash) {
      entries.push(entry);
    }
  }
  return entries;
};

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

export const migrateV1ToV2 = async () => {
  console.log("Migrating entries from v1 to v2");
  const legacyEntries = await getLegacyEntries();
  // console.log("legacyEntries:", legacyEntries);
  if (legacyEntries.length === 0) return new Map<string, TOTPEntry>();
  return new Map(
    [...(legacyEntries?.values() ?? [])].map((entry) => {
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
            type: entry.type === 1 || entry.type === ("totp" as unknown) ? "totp" : "hotp",
            algorithm: entry.algorithm === 1 || entry.algorithm === ("SHA1" as unknown) ? "SHA1" : "SHA256",
          } as TOTPEntry,
        ];
      }
    })
  );
};

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

export async function addFromBackground(entry: TOTPEntry) {
  const entriesStorage = await chrome.storage.local.get([ENTRIES_STOTAGE_KEY]);
  if (entriesStorage) {
    const entriesStorageParse = superjson.parse(entriesStorage[ENTRIES_STOTAGE_KEY]) as StorageValue<EntryState>;
    entriesStorageParse.state.entries = new Map([[entry.hash, entry], ...entriesStorageParse.state.entries]);
    await chrome.storage.local.set({ [ENTRIES_STOTAGE_KEY]: superjson.stringify(entriesStorageParse) });
  } else {
    const draftParse = superjson.parse(JSON.stringify(draftStorage)) as StorageValue<EntryState>;
    draftParse.state.entries = new Map([[entry.hash, entry]]);
    await chrome.storage.local.set({ [ENTRIES_STOTAGE_KEY]: superjson.stringify(draftParse) });
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
