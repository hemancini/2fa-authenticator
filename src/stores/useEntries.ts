import type { EntryState, OTPEntry } from "@src/otp/type";
import { decrypt, encrypt } from "@src/utils/crypto";
import superjson from "superjson";
import { create } from "zustand";
import { persist, type PersistStorage } from "zustand/middleware";

const { ENCRYPTED: isEncrypted = false } = import.meta.env;
console.log("isEncrypted:", isEncrypted);

export const storage: PersistStorage<EntryState> = {
  getItem: (name) => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    return superjson.parse(isEncrypted ? decrypt(str) : str);
  },
  setItem: (name, value) => {
    localStorage.setItem(name, isEncrypted ? encrypt(superjson.stringify(value)) : superjson.stringify(value));
  },
  removeItem: (name) => localStorage.removeItem(name),
};

export const chromePersistStorage: PersistStorage<EntryState> = {
  getItem: async (name) =>
    await chrome.storage.local.get([name]).then((result) => {
      if (!result[name]) return null;
      return superjson.parse(isEncrypted ? decrypt(result[name]) : result[name]);
    }),
  setItem: (name, value) => {
    const stringified = superjson.stringify(value);
    chrome.storage.local.set({ [name]: isEncrypted ? encrypt(stringified) : stringified });
  },
  removeItem: (name) => chrome.storage.local.remove([name]),
};

export const useEntries = create(
  persist<EntryState>(
    (set) => ({
      entries: new Map<string, OTPEntry>(),
      setEntries: (entries: Map<string, OTPEntry>) => set({ entries }),
      addEntry: (entry: OTPEntry) =>
        set((state: EntryState) => {
          // state.entries.set(entry.hash, entry);
          state.entries = new Map([[entry.hash, entry], ...Array.from(state.entries)]);
          return { entries: state.entries };
        }),
      removeEntry: (hash: string) =>
        set((state: EntryState) => {
          state.entries.delete(hash);
          return { entries: state.entries };
        }),
      upsertEntry: (entry: OTPEntry) =>
        set((state: EntryState) => {
          state.entries.set(entry.hash, entry);
          return { entries: state.entries };
        }),
      framerReorder: (entries: OTPEntry[]) =>
        set((state: EntryState) => {
          state.entries = new Map(entries.map((entry) => [entry.hash, entry]));
          return { entries: state.entries };
        }),
      removeAll: () =>
        set((state: EntryState) => {
          state.entries = new Map();
          return { entries: state.entries };
        }),
    }),
    {
      name: "entries-v2",
      storage: chromePersistStorage,
    }
  )
);
