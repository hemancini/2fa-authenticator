import type { OTPEntry, TEntries } from "@src/otp/type";
import { decrypt, encrypt } from "@src/utils/crypto";
import superjson from "superjson";

const { CHROME_STORAGE_KEY: stogeKey = "entries-v3", ENCRYPTED: isEncrypted = true } = import.meta.env;

export class ChromeStorage<T> {
  private storageArea: chrome.storage.StorageArea;

  constructor(storageArea: "sync" | "local") {
    this.storageArea = chrome.storage[storageArea];
  }

  get(): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      this.storageArea.get(stogeKey, (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          try {
            const value = result[stogeKey];
            const parsed = superjson.parse(isEncrypted ? decrypt(value) : value) as T;
            resolve(value === undefined ? undefined : parsed);
          } catch (error) {
            this.remove();
            resolve(undefined);
          }
        }
      });
    });
  }

  set(value: T): Promise<void> {
    return new Promise((resolve, reject) => {
      const stringified = superjson.stringify(value);
      const items = { [stogeKey]: isEncrypted ? encrypt(stringified) : stringified };
      this.storageArea.set(items, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }

  remove(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storageArea.remove(stogeKey, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * @deprecated since version 1.3.0
   */
  clear(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storageArea.clear(() => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * @deprecated since version 1.3.0
   */
  getAll(): Promise<{ [key: string]: T }> {
    return new Promise((resolve, reject) => {
      this.storageArea.get(null, (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result);
        }
      });
    });
  }
}

export class Entries {
  private storage = new ChromeStorage<TEntries>("local");

  async getEntries(): Promise<TEntries> {
    const entries = await this.storage.get();
    return entries ?? new Map<string, OTPEntry>();
  }

  async setEntries(entries: TEntries): Promise<TEntries> {
    await this.storage.set(entries);
    return entries;
  }

  async addEntry(entry: OTPEntry): Promise<OTPEntry> {
    const entries = await this.getEntries();
    entries.set(entry.hash, entry);
    await this.setEntries(entries);
    return entry;
  }

  async removeEntry(hash: string): Promise<void> {
    const entries = await this.getEntries();
    entries.delete(hash);
    await this.setEntries(entries);
  }

  async clearEntries(): Promise<void> {
    await this.storage.remove();
  }
}
