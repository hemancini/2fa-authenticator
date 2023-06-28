/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import { OTPEntry } from "@src/models/otp";
import { EntryStorage } from "@src/models/storage";
import React, { createContext, useCallback, useEffect, useState } from "react";

const Context = createContext({
  second: 0,
  entries: [],
  entriesEdited: [],
  onSaveEdited: false,
  updateEntriesState: (source: string) => {},
  setEntriesEdited: (entries: OTPEntry[]) => {},
  setOnSaveEdited: (onSaveEdited: boolean) => {},
});

export function EntriesContextProvider({ children }: { children: React.ReactNode }) {
  const [onSaveEdited, setOnSaveEdited] = useState<undefined | boolean>(undefined);
  const [entriesEdited, setEntriesEdited] = useState<OTPEntry[]>([]);
  const [entries, setEntries] = useState<OTPEntry[]>([]);
  const [second, setSecond] = useState<number>(0);

  const updateCodes = useCallback(() => {
    const period = entries?.[0]?.period || 30;
    let second = new Date().getSeconds();
    if (localStorage.offset) {
      // prevent second from negative
      second += Number(localStorage.offset) + 60;
    }
    second = second % 60;
    setSecond(second);
    const time = period - (second % period);
    if (time === period) {
      (async () => {
        await updateEntriesState("popup");
      })();
    }
  }, []);

  const removeEntries = async (entriesEdited: OTPEntry[]) => {
    const entries = (await EntryStorage.get()) as OTPEntry[];
    const entriesToRemove = entries.filter(
      (entry) => !entriesEdited.some((entryEdit) => entryEdit.hash === entry.hash)
    );
    if (entriesToRemove.length > 0) {
      console.log("entriesToRemove:", JSON.stringify(entriesToRemove, null, 2));
      await Promise.all(
        entriesToRemove.map(async (entry) => {
          await EntryStorage.remove(entry.hash);
        })
      );
    }
  };

  const updateEntriesState = async (typeUpdate?: "popup" | "edit" | "all"): Promise<OTPEntry[]> => {
    console.log("updateEntriesState");
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
    updateCodes();
    updateEntriesState("all");
    const interval = setInterval(() => {
      updateCodes();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (onSaveEdited !== undefined) {
      const entriesSorted = entriesEdited.map((entry, index) => ({ ...entry, index })) as OTPEntry[];
      (async () => {
        await EntryStorage.set(entriesSorted);
        await removeEntries(entriesSorted);
        await updateEntriesState("all");
      })();
    }
  }, [onSaveEdited]);

  return (
    <Context.Provider
      value={{ entries, second, onSaveEdited, setOnSaveEdited, entriesEdited, setEntriesEdited, updateEntriesState }}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
