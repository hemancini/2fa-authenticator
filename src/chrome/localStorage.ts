import { CHROME_STORAGE_AREA } from "@src/config";

interface StorageData {
  [key: string]: unknown;
}

class ChromeStorage {
  private storageArea: chrome.storage.StorageArea;

  constructor(storageType: "local" | "sync" = "sync") {
    this.storageArea = chrome.storage[storageType];
  }

  // Set item in storage
  setItem(key: string, value: unknown): Promise<void> {
    return new Promise((resolve, reject) => {
      const data: StorageData = {};
      data[key] = value;
      this.storageArea.set(data, () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve();
        }
      });
    });
  }

  // Get item from storage
  getItem<T>(key: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      this.storageArea.get(key, (result) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(result[key] !== undefined ? result[key] : null);
        }
      });
    });
  }

  // Remove item from storage
  removeItem(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storageArea.remove(key, () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve();
        }
      });
    });
  }

  // Clear all items from storage
  clear(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storageArea.clear(() => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve();
        }
      });
    });
  }

  getAll(): Promise<StorageData> {
    return new Promise((resolve, reject) => {
      this.storageArea.get(null, (data) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(data);
        }
      });
    });
  }
}

const storage = new ChromeStorage(CHROME_STORAGE_AREA);

export const getAll = () =>
  storage
    .getAll()
    .then((data) => {
      // console.log("All data:", data);
      return data;
    })
    .catch((error) => console.error("Error getting all data:", error));

export const remove = async (key: string) => {
  storage
    .removeItem(key)
    // .then(() => console.log("Item removed"))
    .catch((error) => console.error("Error removing item:", error));
};

// storage
//   .setItem("key", "value")
//   .then(() => console.log("Item set"))
//   .catch((error) => console.error("Error setting item:", error));

// storage
//   .getItem<string>("key")
//   .then((value) => console.log("Retrieved value:", value))
//   .catch((error) => console.error("Error getting item:", error));

// storage
//   .clear()
//   .then(() => console.log("Storage cleared"))
//   .catch((error) => console.error("Error clearing storage:", error));
