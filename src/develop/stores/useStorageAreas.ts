import { create } from "zustand";

export interface StorageAreas {
  local: unknown[];
  sync: unknown[];
  session: unknown[];
}

export interface IData {
  type: "local" | "sync" | "session";
  title: string;
  value: unknown;
}

export interface UseStorageAreas {
  allData: StorageAreas;
  setAllData: (data: StorageAreas) => void;
  isEditing: boolean;
  toggleEditing: () => void;
  saveDataContent: (data: IData) => void;
  removeData: (data: IData) => void;
}

export const useStorageAreas = create<UseStorageAreas>((set) => ({
  allData: { local: [], sync: [], session: [] } as StorageAreas,
  setAllData: (allData: StorageAreas) => set({ allData }),
  isEditing: false,
  toggleEditing: () => set((state) => ({ isEditing: !state.isEditing })),
  saveDataContent: (data: IData) =>
    set((state) => {
      updateStorage(data);
      return {
        allData: {
          ...state.allData,
          [data.type]: {
            ...state.allData[data.type],
            [data.title]: data.value,
          },
        },
      };
    }),
  removeData: (data: IData) =>
    set((state) => {
      removeStorage(data);
      const newData = { ...state.allData };
      delete newData[data.type][data.title];
      return { allData: newData };
    }),
}));

const updateStorage = (data: IData) => {
  chrome.storage[data.type].set({ [data.title]: data.value });
};

const removeStorage = async (data: IData) => {
  await chrome.storage[data.type].remove(data.title);
};
