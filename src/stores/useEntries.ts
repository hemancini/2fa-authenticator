import superjson from "superjson";
import { create } from "zustand";
import { persist, type PersistStorage } from "zustand/middleware";

import type { EntryState, OTPEntry } from "../otp/type";
import { decrypt, encrypt } from "../utils/crypto";

const { isEncrypted = true } = import.meta.env;

const storage: PersistStorage<EntryState> = {
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
  persist(
    (set) => ({
      entries: new Map<string, OTPEntry>(),
      addEntry: (entry: OTPEntry) =>
        set((state: EntryState) => {
          state.entries.set(entry.hash, entry);
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
