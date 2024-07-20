import CryptoJS from "crypto-js";

import type { OTPEntry } from "./otp";
import { EntryStorage } from "./storage";

type BackupData = {
  data: string;
};

/**
 * @deprecated since version 1.3.0
 */
export default class Backup {
  static async set({ data }: BackupData) {
    if (!data) throw new Error("No data provided");
    const decryptedData = CryptoJS.AES.decrypt(data, import.meta.env.VITE_APP_KEY || DEFAULT_APP_KEY).toString(
      CryptoJS.enc.Utf8
    );
    const entriesLegacy: OTPEntry[] = JSON.parse(decryptedData);
    if (!entriesLegacy?.[0]?.secret) throw new Error("Invalid data provided");
    await EntryStorage.set(entriesLegacy);
  }

  static async get() {
    const data = await EntryStorage.get();
    if (!data?.length) throw new Error("No data found", { cause: "notEntriesFound" });
    const dataEncrypted = {
      data: CryptoJS.AES.encrypt(JSON.stringify(data), import.meta.env.VITE_APP_KEY || DEFAULT_APP_KEY).toString(),
    };
    return dataEncrypted;
  }
}
