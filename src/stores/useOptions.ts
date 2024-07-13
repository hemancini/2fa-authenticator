import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";

const chromeStorageKey = "2fa-options";

interface OptionsStore {
  themeMode: ThemeMode;
  toggleThemeMode: (mode: ThemeMode) => void;
  themeColor: DefaultColorHexes;
  toggleThemeColor: (color: DefaultColorHexes) => void;
  tooltipEnabled: boolean;
  toggleTooltipEnabled: () => void;
  bypassEnabled: boolean;
  toggleBypassEnabled: () => void;
  autofillEnabled: boolean;
  toggleAutofillEnabled: () => void;
  xraysEnabled: boolean;
  isVisibleCodes: boolean;
  setVisibleCodes: (isVisible: boolean) => void;
  isNewVersion: boolean;
  toggleNewVersion: () => void;
}

const chromePersistStorage: PersistStorage<OptionsStore> = {
  getItem: async (name) => await chrome.storage.local.get([name]).then((result) => result[name]),
  setItem: (name, value) => chrome.storage.local.set({ [name]: value }),
  removeItem: (name) => chrome.storage.local.remove([name]),
};

export const useOptionsStore = create<OptionsStore>()(
  persist(
    (set) => ({
      themeMode: DEFAULT_MODE,
      toggleThemeMode: (mode) => {
        set({ themeMode: mode });
      },
      themeColor: DEFAULT_COLOR,
      toggleThemeColor: (color) => {
        set({ themeColor: color });
      },
      tooltipEnabled: true,
      toggleTooltipEnabled: () => {
        set((state) => ({ tooltipEnabled: !state.tooltipEnabled }));
      },
      bypassEnabled: false,
      toggleBypassEnabled: () => {
        set((state) => ({ bypassEnabled: !state.bypassEnabled }));
      },
      autofillEnabled: true,
      toggleAutofillEnabled: () => {
        set((state) => ({ autofillEnabled: !state.autofillEnabled }));
      },
      xraysEnabled: false,
      isVisibleCodes: false,
      setVisibleCodes: (isVisibleCodes) => {
        set({ isVisibleCodes });
      },
      isNewVersion: false,
      toggleNewVersion: () => {
        set((state) => ({ isNewVersion: !state.isNewVersion }));
      },
    }),
    {
      name: chromeStorageKey, // name of the item in the storage (must be unique)
      storage: chromePersistStorage, // (optional) by default, 'localStorage' is used
    }
  )
);
