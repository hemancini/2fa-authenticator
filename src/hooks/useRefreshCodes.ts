import EntriesContext from "@src/contexts/Entries";
import { useCallback, useContext, useEffect, useState } from "react";

export default function useRefreshCodes(): void {
  const { entries, handleEntriesUpdate } = useContext(EntriesContext);
  const [periods, setPeriods] = useState<number[]>([]);
  const [second, setSecond] = useState<number>(new Date().getSeconds());

  const updateCodes = useCallback(() => {
    if (!periods.length) return;

    for (let i = 0; i < periods.length; i++) {
      const period = periods[i];
      const discount = period - (second % period);
      if (discount === 1) {
        setTimeout(() => {
          handleEntriesUpdate();
        }, 1000);
        break;
      }
    }
  }, [second, periods]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecond(new Date().getSeconds());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    updateCodes();
  }, [second]);

  useEffect(() => {
    const getAllPeriods = entries.map((entry) => entry.period);
    const periods = [...new Set(getAllPeriods)];
    setPeriods(periods);
  }, [entries]);
}
