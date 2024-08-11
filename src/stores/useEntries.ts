import { CHROME_STORAGE_AREA, STORAGE_ENTRIES_KEY } from "@src/config";
import type { EntryState, OTPEntry } from "@src/entry/type";
import { useOptionsStore } from "@src/stores/useOptions";
import { decrypt, encrypt } from "@src/utils/crypto";
import superjson from "superjson";
import { create } from "zustand";
import { persist, type PersistStorage } from "zustand/middleware";

const isEncrypted = !(import.meta.env.VITE_DATA_ENCRYPTED === "false");

export const chromePersistStorage: PersistStorage<EntryState> = {
  getItem: async (name) =>
    await chrome.storage[CHROME_STORAGE_AREA].get([name]).then((result) => {
      if (!result[name]) return null;
      return superjson.parse(isEncrypted ? decrypt(result[name]) : result[name]);
    }),
  setItem: (name, value) => {
    const stringified = superjson.stringify(value);
    chrome.storage[CHROME_STORAGE_AREA].set({ [name]: isEncrypted ? encrypt(stringified) : stringified });
  },
  removeItem: (name) => chrome.storage[CHROME_STORAGE_AREA].remove([name]),
};

const checkEntry = (entry: OTPEntry): OTPEntry => {
  const { isVisibleTokens = true } = useOptionsStore.getState();
  const newEntry: OTPEntry = { ...entry, isVisible: isVisibleTokens };
  return newEntry;
};

export const useEntries = create(
  persist<EntryState>(
    (set) => ({
      entries: new Map<string, OTPEntry>(),
      setEntries: (entries: Map<string, OTPEntry>) =>
        set((state) => {
          state.entries = new Map(Array.from(entries).map(([hash, entry]) => [hash, checkEntry(entry)]));
          return { entries: state.entries };
        }),
      addEntry: (entry: OTPEntry) =>
        set((state: EntryState) => {
          const newEntry = checkEntry(entry);
          state.entries = new Map([[newEntry.hash, newEntry], ...Array.from(state.entries)]);
          return { entries: state.entries };
        }),
      removeEntry: (hash: string) =>
        set((state: EntryState) => {
          state.entries.delete(hash);
          return { entries: state.entries };
        }),
      upsertEntry: (entry: OTPEntry) =>
        set((state: EntryState) => {
          const newEntry = checkEntry(entry);
          state.entries.set(newEntry.hash, newEntry);
          return { entries: state.entries };
        }),
      framerReorder: (entries: OTPEntry[]) =>
        set((state: EntryState) => {
          state.entries = new Map(entries.map((entry) => [entry.hash, entry]));
          return { entries: state.entries };
        }),
      toggleVisible: (hash: string) =>
        set((state: EntryState) => {
          const entry = state.entries.get(hash);
          if (entry) {
            const isVisible = !entry.isVisible;
            state.entries.set(hash, { ...entry, isVisible });
          }
          return { entries: state.entries };
        }),
      toggleVisibleTokens: () =>
        set((state: EntryState) => {
          const { isVisibleTokens } = useOptionsStore.getState();
          state.entries.forEach((entry) => (entry.isVisible = !isVisibleTokens));
          return { entries: state.entries };
        }),
      removeAll: () =>
        set((state: EntryState) => {
          state.entries = new Map();
          return { entries: state.entries };
        }),
    }),
    {
      name: STORAGE_ENTRIES_KEY,
      storage: chromePersistStorage,
    }
  )
);
