import type { OTPEntry } from "@src/entry/type";
import { decrypData, encrypData } from "@src/utils/crypto";
import { getBackgroundEntries } from "@src/utils/entry";

export const exportBackup = async (): Promise<Blob> => {
  const entries = (await getBackgroundEntries()) ?? new Map();
  if (entries.size === 0) throw new Error("No data found", { cause: "notEntriesFound" });
  const encryptedData = encrypData(JSON.stringify(Array.from(entries?.values() ?? [])));
  const blobData = new Blob([JSON.stringify({ data: encryptedData }, null, 2)], { type: "application/json" });
  return blobData;
};

export const decryptBackup = async ({ data }: { data: string }) => {
  const decryptedData = decrypData(data);
  const entriesArray = JSON.parse(decryptedData) as OTPEntry[];
  const entries = new Map(entriesArray.map((entry) => [entry.hash, entry]));
  return entries;
};
