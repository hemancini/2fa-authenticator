/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import { OTPEntry } from "@src/models/otp";
import { EntryStorage } from "@src/models/storage";
import React, { createContext, useEffect, useMemo, useState } from "react";

const Context = createContext({
  second: 0,
  entries: [],
  entriesEdited: [],
  setEntries: (entries: OTPEntry[]) => { },
  setEntriesEdited: (entries: OTPEntry[]) => { },
  handleEntriesEdited: () => { },
  handleEntriesUpdate: () => { },
});

export function EntriesProvider({ children }: { children: React.ReactNode }) {
  const [second, setSecond] = useState<number>(new Date().getSeconds());
  const [entriesEdited, setEntriesEdited] = useState<OTPEntry[]>([]);
  const [entries, setEntries] = useState<OTPEntry[]>([]);

  const updateCodes = () => {
    const getAllPeriods = entries.map((entry) => entry.period);
    const periods = [...new Set(getAllPeriods)];
    periods.map((period) => {
      const discount = period - (second % period);
      if (discount === 1) {
        setTimeout(() => {
          updateEntriesState("popup");
        }, 1000);
      }
    });
  };

  const removeEntries = async (entriesEdited: OTPEntry[]) => {
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
  };

  const updateEntriesState = async (typeUpdate?: "popup" | "edit" | "all"): Promise<OTPEntry[]> => {
    console.log("updateEntriesState() => typeUpdate:", typeUpdate);
    const entries = await EntryStorage.get();
    if (typeUpdate === "popup") {
      setEntries(entries);
    } else if (typeUpdate === "edit") {
      setEntriesEdited(entries);
    } else if (typeUpdate === "all") {
      setEntries(entries);
      setEntriesEdited(entries);
    }
    return entries;
  };

  useEffect(() => {
    updateEntriesState("all");
  }, []);

  useEffect(() => {
    updateCodes();
    const timer = setTimeout(() => {
      setSecond(new Date().getSeconds());
    }, 1000);
    return () => clearTimeout(timer);
  }, [second]);

  const handlers = useMemo(
    () => ({
      handleEntriesEdited: () => {
        const entriesSorted = entriesEdited.map((entry, index) => ({ ...entry, index })) as OTPEntry[];
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
        second,
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
