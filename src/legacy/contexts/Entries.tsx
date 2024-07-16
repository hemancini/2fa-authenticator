import { OTPEntry } from "@src/models/otp";
import { EntryStorage } from "@src/models/storage";
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

const Context = createContext({
  entries: [],
  entriesEdited: [],
  isLoading: true,
  setEntries: (entries: OTPEntry[]) => void 0,
  setEntriesEdited: (entries: OTPEntry[]) => void 0,
  handleEntriesEdited: () => void 0,
  handleEntriesUpdate: () => void 0,
});

export function EntriesProviderLegacy({ children }: { children: React.ReactNode }) {
  const [entriesEdited, setEntriesEdited] = useState<OTPEntry[]>([]);
  const [entries, setEntries] = useState<OTPEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const removeEntries = useCallback(async (entriesEdited: OTPEntry[]) => {
    const entries = (await EntryStorage.get()) as OTPEntry[];
    const entriesToRemove = entries.filter(
      (entry) => !entriesEdited.some((entryEdit) => entryEdit.hash === entry.hash)
    );
    if (entriesToRemove.length > 0) {
      await Promise.all(
        entriesToRemove.map(async (entry) => {
          await EntryStorage.remove(entry.hash);
        })
      );
    }
  }, []);

  const updateEntriesState = useCallback(async (typeUpdate?: "popup" | "edit" | "all"): Promise<OTPEntry[]> => {
    // console.log("updateEntriesState() => typeUpdate:", typeUpdate);
    const entries = await EntryStorage.get();
    if (typeUpdate === "popup") {
      setEntries(entries);
    } else if (typeUpdate === "edit") {
      setEntriesEdited(entries);
    } else if (typeUpdate === "all") {
      setEntries(entries);
      setEntriesEdited(entries);
    }

    if (isLoading) {
      setIsLoading(false);
    }
    return entries;
  }, []);

  useEffect(() => {
    updateEntriesState("all");
  }, []);

  const handlers = useMemo(
    () => ({
      handleEntriesEdited: () => {
        const entriesSorted = entriesEdited.map((entry, index) => ({
          ...entry,
          index,
        })) as OTPEntry[];
        (async () => {
          await EntryStorage.set(entriesSorted);
          await removeEntries(entriesSorted);
          await updateEntriesState("all");
        })();
      },
      handleEntriesUpdate: async () => {
        await updateEntriesState("all");
      },
    }),
    [entriesEdited]
  );

  return (
    <Context.Provider
      value={{
        isLoading,
        ...handlers,
        ...{ entries, setEntries },
        ...{ entriesEdited, setEntriesEdited },
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
