import type { EntryState, OTPEntry } from "@src/entry/type";
import { decrypt, encrypt } from "@src/utils/crypto";
import superjson from "superjson";
import { create } from "zustand";
import { persist, type PersistStorage } from "zustand/middleware";

const storageArea = "sync";
const isEncrypted = !(import.meta.env.VITE_DATA_ENCRYPTED === "false");

export const chromePersistStorage: PersistStorage<EntryState> = {
  getItem: async (name) =>
    await chrome.storage[storageArea].get([name]).then((result) => {
      if (!result[name]) return null;
      return superjson.parse(isEncrypted ? decrypt(result[name]) : result[name]);
    }),
  setItem: (name, value) => {
    const stringified = superjson.stringify(value);
    chrome.storage[storageArea].set({ [name]: isEncrypted ? encrypt(stringified) : stringified });
  },
  removeItem: (name) => chrome.storage[storageArea].remove([name]),
};

export const useEntries = create(
  persist<EntryState>(
    (set) => ({
      entries: new Map<string, OTPEntry>(),
      setEntries: (entries: Map<string, OTPEntry>) =>
        set((state: EntryState) => {
          state.entries = entries;
          return { entries: state.entries };
        }),
      addEntry: (entry: OTPEntry) =>
        set((state: EntryState) => {
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
      name: "entries",
      storage: chromePersistStorage,
    }
  )
);
