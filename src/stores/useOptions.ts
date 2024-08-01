import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";

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
  isVisibleTokens: boolean;
  toggleVisibleTokens: () => void;
}

const chromePersistStorage: PersistStorage<OptionsStore> = {
  getItem: async (name) => await chrome.storage[CHROME_STORAGE_AREA].get([name]).then((result) => result[name]),
  setItem: (name, value) => chrome.storage[CHROME_STORAGE_AREA].set({ [name]: value }),
  removeItem: (name) => chrome.storage[CHROME_STORAGE_AREA].remove([name]),
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
      isVisibleTokens: false,
      toggleVisibleTokens: () => {
        set((state) => ({ isVisibleTokens: !state.isVisibleTokens }));
      },
    }),
    {
      name: STORAGE_OPTIONS_KEY,
      storage: chromePersistStorage,
    }
  )
);
