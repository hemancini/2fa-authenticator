/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import { OTPEntry } from "@src/models/otp";
import { EntryStorage } from "@src/models/storage";
import React, { createContext, useCallback, useEffect, useState } from "react";

const Context = createContext({
  second: 0,
  entries: [],
  entriesEdit: [],
  onSaveEdit: false,
  setOnSaveEdit: (onSaveEdit: boolean) => {},
  setEntriesEdit: (entries: OTPEntry[]) => {},
});

export function EntriesContextProvider({ children }: { children: React.ReactNode }) {
  const [entriesEdit, setEntriesEdit] = useState<OTPEntry[]>([]);
  const [onSaveEdit, setOnSaveEdit] = useState<boolean>(false);
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

  const removeEntries = async (entriesSorted: OTPEntry[]) => {
    const entries = (await EntryStorage.get()) as OTPEntry[];
    const entriesDiff = entries.filter((entry) => !entriesSorted.some((entryEdit) => entryEdit.hash === entry.hash));
    console.log("entriesDiff.length:", entriesDiff.length);
    if (entriesDiff.length > 0) {
      console.log("entriesDiff:", JSON.stringify(entriesDiff, null, 2));
      await Promise.all(
        entriesDiff.map(async (entry) => {
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
      setEntriesEdit(entries);
    } else if (typeUpdate === "all") {
      setEntries(entries);
      setEntriesEdit(entries);
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
    console.log("onSaveEdit");
    const entriesSorted = entriesEdit.map((entry, index) => ({ ...entry, index })) as OTPEntry[];
    if (entriesSorted.length > 0) {
      (async () => {
        await EntryStorage.set(entriesSorted);
        await removeEntries(entriesSorted);
        await updateEntriesState("all");
      })();
    }
  }, [onSaveEdit]);

  return (
    <Context.Provider value={{ entries, second, onSaveEdit, setOnSaveEdit, entriesEdit, setEntriesEdit }}>
      {children}
    </Context.Provider>
  );
}

export default Context;
