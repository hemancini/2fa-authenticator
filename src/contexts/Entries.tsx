/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import { OTPEntry } from "@src/models/otp";
import { EntryStorage } from "@src/models/storage";
import React, { createContext, useCallback, useEffect, useState } from "react";

const Context = createContext({
  second: 0,
  entries: [],
  entriesEdit: [],
  onSaveEdit: false,
  setSecond: (second: number) => {},
  setEntries: (entries: OTPEntry[]) => {},
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
        const entries = await EntryStorage.get();
        setEntries(entries);
      })();
    }
  }, [entries]);

  useEffect(() => {
    (async () => {
      const entries = await EntryStorage.get();
      setEntries(entries);
      setEntriesEdit(entries);
    })();
  }, []);

  useEffect(() => {
    updateCodes();
    const interval = setInterval(() => {
      updateCodes();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const entriesSort = entriesEdit.map((entry, index) => ({ ...entry, index })) as OTPEntry[];
    (async () => {
      setEntries(entriesSort);
      await EntryStorage.set(entriesSort);
    })();
    console.log("onSaveEdit");
  }, [onSaveEdit]);

  return (
    <Context.Provider
      value={{ entries, setEntries, second, setSecond, onSaveEdit, setOnSaveEdit, entriesEdit, setEntriesEdit }}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
