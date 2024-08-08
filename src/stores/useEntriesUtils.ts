import type { OTPEntry } from "@src/entry/type";
import { create } from "zustand";

interface utilsState {
  removes: string[];
  addRemove: (hash: string) => void;
  resetRemoves: () => void;
  entriesEdited?: Map<string, OTPEntry>;
  upsertEntryEdited: (entry: OTPEntry) => void;
  resetEntriesEdited: () => void;
}

export const useEntriesUtils = create<utilsState>((set) => ({
  removes: [],
  addRemove: (hash) => set((state) => ({ removes: [...state.removes, hash] })),
  resetRemoves: () => set({ removes: [] }),
  entriesEdited: undefined,
  upsertEntryEdited: (entry) =>
    set((state) => {
      const entries = new Map(state.entriesEdited);
      entries.set(entry.hash, entry);
      return { entriesEdited: entries };
    }),
  resetEntriesEdited: () => set({ entriesEdited: undefined }),
}));
