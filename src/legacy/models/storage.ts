import { Encryption } from "./crypto";
import { OTPAlgorithm, OTPEntry, OTPType } from "./otp";

let LocalStorage: {
  [key: string]: any;
};

export class BrowserStorage {
  private static async getStorageLocation() {
    LocalStorage = (await chrome.storage.local.get("LocalStorage")).LocalStorage || {};
    const managedLocation = await ManagedStorage.get<"sync" | "local">("storageArea");
    if (managedLocation === "sync" || managedLocation === "local") {
      return new Promise((resolve) => {
        if (LocalStorage.storageLocation !== managedLocation) {
          LocalStorage.storageLocation = managedLocation;
          chrome.storage.local.set({ LocalStorage });
        }
        resolve(managedLocation);
        return;
      });
    } else if (LocalStorage.storageLocation !== "sync" && LocalStorage.storageLocation !== "local") {
      return new Promise((resolve, reject) => {
        let amountSync: number;
        let amountLocal: number;
        chrome.storage.local.get((local) => {
          amountLocal = Object.keys(local).length;
          if (local.LocalStorage) {
            amountLocal--;
          }
          try {
            chrome.storage.sync.get((sync) => {
              amountSync = Object.keys(sync).length;
              // If storage location can't be found try to auto-detect storage
              // location
              if (amountLocal > amountSync && amountSync === 0) {
                LocalStorage.storageLocation = "local";
              } else if (amountLocal < amountSync && amountLocal === 0) {
                LocalStorage.storageLocation = "sync";
              } else {
                // Use default
                LocalStorage.storageLocation = "sync";
              }
              chrome.storage.local.set({ LocalStorage });
              resolve(LocalStorage.storageLocation);
              return;
            });
          } catch (error) {
            reject(error);
            return;
          }
        });
      });
    } else {
      return new Promise((resolve) => {
        resolve(LocalStorage.storageLocation);
        return;
      });
    }
  }

  // TODO: promise this
  static async get() {
    const storageLocation = await this.getStorageLocation();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const removeKey = function (items: { [key: string]: OTPStorage }): void {
      delete items.key;
      delete items.LocalStorage;
    };

    let items = {} as { [key: string]: OTPStorage };

    if (storageLocation === "local") {
      items = await chrome.storage.local.get();
    } else if (storageLocation === "sync") {
      items = await chrome.storage.sync.get();
    }

    removeKey(items);
    return items;
  }

  static getKey() {
    return new Promise((resolve: (key: { enc: string; hash: string } | null) => void) => {
      this.getStorageLocation().then((storageLocation) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const callback = function (items: { [key: string]: any }): void {
          if (typeof items.key === "object") {
            resolve(items.key);
          } else {
            resolve(null);
          }
          return;
        };

        if (storageLocation === "local") {
          chrome.storage.local.get(callback);
        } else if (storageLocation === "sync") {
          chrome.storage.sync.get(callback);
        }
        return;
      });
    });
  }

  static async set(data: object, callback?: (() => void) | undefined) {
    const storageLocation = await this.getStorageLocation();
    if (storageLocation === "local") {
      chrome.storage.local.set(data, callback);
    } else if (storageLocation === "sync") {
      chrome.storage.sync.set(data, callback);
    }
    return;
  }

  static async remove(data: string | string[], callback?: (() => void) | undefined) {
    const storageLocation = await this.getStorageLocation();
    if (storageLocation === "local") {
      chrome.storage.local.remove(data, callback);
    } else if (storageLocation === "sync") {
      chrome.storage.sync.remove(data, callback);
    }
    return;
  }

  // Use for Chrome only.
  // https://github.com/Authenticator-Extension/Authenticator/issues/412
  static async clearLogs() {
    const storageLocation = await this.getStorageLocation();
    if (storageLocation === "local") {
      const data = await chrome.storage.local.get();
      await chrome.storage.local.clear();
      await chrome.storage.local.set(data);
    } else if (storageLocation === "sync") {
      const data = await chrome.storage.sync.get();
      await chrome.storage.sync.clear();
      await chrome.storage.sync.set(data);
    }
  }
}

/**
 * @deprecated since version 1.3.0
 */
export class EntryStorage {
  private static getOTPStorageFromEntry(entry: OTPEntry, unencrypted?: boolean): OTPStorage {
    let secret: string;
    if (entry.encSecret) {
      secret = entry.encSecret;
    } else if (entry.secret) {
      secret = entry.secret;
    } else {
      secret = "";
      console.warn("Invalid entry", entry);
    }

    let encrypted = Boolean(entry.encSecret);

    if (unencrypted && entry.secret) {
      secret = entry.secret;
      encrypted = false;
    }

    const storageItem: OTPStorage = {
      encrypted,
      hash: entry.hash,
      index: entry.index,
      type: OTPType[entry.type],
      secret,
    };

    if (entry.pinned) {
      storageItem.pinned = true;
    }

    if (entry.type === OTPType.hotp || entry.type === OTPType.hhex) {
      storageItem.counter = entry.counter;
    }

    if (entry.period && entry.period !== 30) {
      storageItem.period = entry.period;
    }

    if (entry.issuer) {
      storageItem.issuer = entry.issuer;
    }

    if (entry.account) {
      storageItem.account = entry.account;
    }

    if (entry.digits && entry.digits !== 6) {
      storageItem.digits = entry.digits;
    }

    if (entry.algorithm && entry.algorithm !== OTPAlgorithm.SHA1) {
      storageItem.algorithm = OTPAlgorithm[entry.algorithm];
    }

    if (entry.site) {
      storageItem.site = entry.site;
    }

    if (entry.user) {
      storageItem.user = entry.user;
    }

    if (entry.pass) {
      storageItem.pass = entry.pass;
    }

    return storageItem;
  }

  private static ensureUniqueIndex(_data: { [hash: string]: OTPStorage }) {
    const tempEntryArray: OTPStorage[] = [];

    for (const hash of Object.keys(_data)) {
      if (!this.isValidEntry(_data, hash)) {
        continue;
      }
      tempEntryArray.push(_data[hash]);
    }

    tempEntryArray.sort((a, b) => {
      return a.index - b.index;
    });

    const newData: { [hash: string]: OTPStorage } = {};
    for (let i = 0; i < tempEntryArray.length; i++) {
      tempEntryArray[i].index = i;
      newData[tempEntryArray[i].hash] = tempEntryArray[i];
    }

    return newData;
  }

  private static isOTPStorage(entry: unknown) {
    return entry && Object.prototype.hasOwnProperty.call(entry, "secret");
  }

  private static isValidEntry(_data: { [hash: string]: OTPStorage }, hash: string) {
    const data = _data[hash];
    if (typeof data !== "object") {
      // console.log('Key "' + hash + '" is not an object');
      return false;
    } else if (!this.isOTPStorage(data)) {
      return false;
    }
    return true;
  }

  static async hasEncryptionKey(): Promise<boolean> {
    return Boolean(await BrowserStorage.getKey());
  }

  static async import(encryption: Encryption, data: { [hash: string]: OTPStorage }) {
    let _data = await BrowserStorage.get();
    for (const hash of Object.keys(data)) {
      // never trust data import from user
      // we do not support encrypted data import any longer
      if (!data[hash].secret || data[hash].encrypted) {
        // we need give a failed warning
        continue;
      }

      data[hash].hash = data[hash].hash || hash;
      data[hash].account = data[hash].account || "";
      data[hash].encrypted = encryption.getEncryptionStatus();
      data[hash].index = data[hash].index || 0;
      data[hash].issuer = data[hash].issuer || "";
      data[hash].type = data[hash].type || OTPType[OTPType.totp];
      data[hash].counter = data[hash].counter || 0;
      data[hash].digits = data[hash].digits || 6;
      data[hash].algorithm = data[hash].algorithm || OTPAlgorithm[OTPAlgorithm.SHA1];
      data[hash].pinned = data[hash].pinned || false;
      data[hash].site = data[hash].site || "";
      data[hash].user = data[hash].user || "";
      data[hash].pass = data[hash].pass || "";

      const period = data[hash].period;
      if (data[hash].type !== OTPType[OTPType.totp] || (period && (isNaN(period) || period <= 0))) {
        delete data[hash].period;
      }

      // If invalid digits, then use default.
      const digits = data[hash].digits;
      if (digits && (digits > 10 || digits < 1)) {
        data[hash].digits = 6;
      }

      // If invalid algorithm, then use default
      if (!OTPAlgorithm[data[hash].algorithm]) {
        data[hash].algorithm = OTPAlgorithm[OTPAlgorithm.SHA1];
      }

      if (/^(blz-|bliz-)/.test(data[hash].secret)) {
        const secretMatches = data[hash].secret.match(/^(blz-|bliz-)(.*)/);
        if (secretMatches && secretMatches.length >= 3) {
          data[hash].secret = secretMatches[2];
          data[hash].type = OTPType[OTPType.battle];
        }
      }

      if (/^stm-/.test(data[hash].secret)) {
        const secretMatches = data[hash].secret.match(/^stm-(.*)/);
        if (secretMatches && secretMatches.length >= 2) {
          data[hash].secret = secretMatches[1];
          data[hash].type = OTPType[OTPType.steam];
        }
      }

      if (
        !/^[a-z2-7]+=*$/i.test(data[hash].secret) &&
        /^[0-9a-f]+$/i.test(data[hash].secret) &&
        data[hash].type === OTPType[OTPType.totp]
      ) {
        data[hash].type = OTPType[OTPType.hex];
      }

      if (
        !/^[a-z2-7]+=*$/i.test(data[hash].secret) &&
        /^[0-9a-f]+$/i.test(data[hash].secret) &&
        data[hash].type === OTPType[OTPType.hotp]
      ) {
        data[hash].type = OTPType[OTPType.hhex];
      }

      // not a valid / old hash
      if (!/^[a-f0-9]{8}-?[a-f0-9]{4}-?4[a-f0-9]{3}-?[89ab][a-f0-9]{3}-?[a-f0-9]{12}$/.test(hash)) {
        const _hash = crypto.randomUUID();

        data[_hash] = data[hash];
        data[_hash].hash = _hash;
        delete data[hash];

        data[_hash].secret = encryption.getEncryptedString(data[_hash].secret);
        _data[_hash] = data[_hash];
      } else {
        data[hash].secret = encryption.getEncryptedString(data[hash].secret);
        _data[hash] = data[hash];
      }
    }
    _data = this.ensureUniqueIndex(_data);
    await BrowserStorage.set(_data);
  }

  static async add(entry: OTPEntry) {
    await BrowserStorage.set({
      [entry.hash]: this.getOTPStorageFromEntry(entry),
    });
  }

  static async update(entry: OTPEntry) {
    let _data = await BrowserStorage.get();
    if (!Object.prototype.hasOwnProperty.call(_data, entry.hash)) {
      throw new Error("Entry to change does not exist.");
    }
    const storageItem = this.getOTPStorageFromEntry(entry);
    _data[entry.hash] = storageItem;
    _data = this.ensureUniqueIndex(_data);
    await BrowserStorage.set(_data);
  }

  static async set(entries: OTPEntry[]) {
    let _data = await BrowserStorage.get();
    entries.forEach((entry) => {
      const storageItem = this.getOTPStorageFromEntry(entry);
      _data[entry.hash] = storageItem;
    });
    _data = this.ensureUniqueIndex(_data);
    await BrowserStorage.set(_data);
  }

  static async get() {
    const _data = await BrowserStorage.get();
    const data: OTPEntry[] = [];

    for (const hash of Object.keys(_data)) {
      if (!this.isValidEntry(_data, hash)) {
        continue;
      }
      const entryData = _data[hash];

      if (!entryData.hash) {
        entryData.hash = hash;
      }

      if (!entryData.type) {
        entryData.type = OTPType[OTPType.totp];
      }

      let type: OTPType;
      switch (entryData.type) {
        case "totp":
        case "hotp":
        case "battle":
        case "steam":
        case "hex":
        case "hhex":
          type = OTPType[entryData.type];
          break;
        default:
          // we need correct the type here
          // and save it
          type = OTPType.totp;
          entryData.type = OTPType[OTPType.totp];
      }

      let period: number | undefined;
      if (entryData.type === OTPType[OTPType.totp] && entryData.period && entryData.period > 0) {
        period = entryData.period;
      }

      const entry = new OTPEntry({
        account: entryData.account,
        encrypted: entryData.encrypted,
        hash: entryData.hash,
        index: entryData.index,
        issuer: entryData.issuer,
        secret: entryData.secret,
        type,
        counter: entryData.counter,
        period,
        digits: entryData.digits,
        algorithm: OTPAlgorithm[entryData.algorithm],
        pinned: entryData.pinned,
        site: entryData.site,
        user: entryData.user,
        pass: entryData.pass,
      });

      data.push(entry);

      data.sort((a, b) => {
        return a.index - b.index;
      });
    }
    return data;
  }

  static async remove(hash: string) {
    await BrowserStorage.remove(hash);
  }

  static async delete(entry: OTPEntry) {
    let _data = await BrowserStorage.get();
    if (Object.prototype.hasOwnProperty.call(_data, entry.hash)) {
      delete _data[entry.hash];
    }
    _data = this.ensureUniqueIndex(_data);
    await BrowserStorage.remove(entry.hash);
    await BrowserStorage.set(_data);
  }
}

export class ManagedStorage {
  static get<T>(key: string): T | undefined;
  static get<T>(key: string, defaultValue: T): T;
  static get<T>(key: string, defaultValue?: T) {
    return new Promise((resolve: (result: T | undefined) => void) => {
      if (chrome.storage.managed) {
        chrome.storage.managed.get((data) => {
          if (chrome.runtime.lastError) {
            return resolve(defaultValue);
          }
          if (data) {
            if (data[key]) {
              return resolve(data[key]);
            }
          }
          return resolve(defaultValue);
        });
      } else {
        // no available in Safari
        resolve(defaultValue);
      }
    });
  }
}
