import type { OTPEntry } from "@src/otp/type";
import { storage } from "@src/stores/useEntries";
import CryptoJS from "crypto-js";

const appKey = import.meta.env.VITE_APP_KEY || DEFAULT_APP_KEY;

export const exportBackup = async (): Promise<Blob> => {
  const entriesStore = await storage.getItem("entries-v2");
  if (!entriesStore) throw new Error("No data found", { cause: "notEntriesFound" });

  const { entries = new Map() } = entriesStore.state;
  if (entries.size === 0) throw new Error("No data found", { cause: "notEntriesFound" });

  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(Array.from(entries?.values() ?? [])), appKey).toString();
  const dataBlob = new Blob([JSON.stringify({ encrypted }, null, 2)], { type: "application/json" });
  return dataBlob;
};

export const decryptBackup = async ({ data }: { data: string }) => {
  const entriesString = CryptoJS.AES.decrypt(data, appKey).toString(CryptoJS.enc.Utf8);
  const entriesArray = JSON.parse(entriesString) as OTPEntry[];
  const entries = new Map(entriesArray.map((entry) => [entry.hash, entry]));
  return entries;
};
