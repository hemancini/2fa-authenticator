import type { EntryState, OTPEntry } from "@src/otp/type";
import { decrypt, encrypt } from "@src/utils/crypto";
import superjson from "superjson";
import { create } from "zustand";
import { persist, type PersistStorage } from "zustand/middleware";

const { isEncrypted = true } = import.meta.env;

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
    }),
    {
      name: "entries-v2",
      storage,
    }
  )
);
