/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import { OTPEntry } from "@src/models/otp";
import { EntryStorage } from "@src/models/storage";
import React, { createContext, useCallback, useEffect, useState } from "react";

const Context = createContext({
  second: 0,
  entries: [],
  entriesEdited: [],
  onSaveEdited: false,
  setEntries: (entries: OTPEntry[]) => {},
  updateEntriesState: (source: string) => {},
  setEntriesEdited: (entries: OTPEntry[]) => {},
  setOnSaveEdited: (onSaveEdited: boolean) => {},
});

export function EntriesContextProvider({ children }: { children: React.ReactNode }) {
  const [onSaveEdited, setOnSaveEdited] = useState<undefined | boolean>(undefined);
  const [entriesEdited, setEntriesEdited] = useState<OTPEntry[]>([]);
  const [entries, setEntries] = useState<OTPEntry[]>([]);

  const [second, setSecond] = useState<number>(new Date().getSeconds());
  const [period, setPeriod] = useState<undefined | number>(undefined);

  const updateCodes = () => {
    if (period === undefined && entries.length > 0) {
      const minPeriod = entries.reduce((period, entry) => {
        const añoNacimiento = entry.period;
        return añoNacimiento < period ? añoNacimiento : period;
      }, Infinity);
      setPeriod(minPeriod || 30);
    }

    const discount = period - (second % period);
    if (discount === 1 || (isNaN(discount) && /^(60|30|1)$/.test(String(second)))) {
      setTimeout(() => {
        updateEntriesState("popup");
      }, 1000);
    }
  };

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
    setPeriod(undefined);
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
      value={{
        entries,
        second,
        setEntries,
        onSaveEdited,
        entriesEdited,
        setOnSaveEdited,
        setEntriesEdited,
        updateEntriesState,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
