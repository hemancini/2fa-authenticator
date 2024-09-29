import { CHROME_STORAGE_AREA, DEFAULT_COLOR, DEFAULT_MODE, STORAGE_OPTIONS_KEY } from "@src/config";
import { useEntries } from "@src/stores/useEntries";
import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";

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
      toggleXraysEnabled: () => {
        set((state) => ({ xraysEnabled: !state.xraysEnabled }));
      },
      isVisibleTokens: true,
      toggleVisibleTokens: () => {
        set((state) => {
          useEntries.getState().toggleVisibleTokens();
          return { isVisibleTokens: !state.isVisibleTokens };
        });
      },
      useLegacyEntryCard: false,
      toggleUseLegacyEntryCard: () => {
        set((state) => ({ useLegacyEntryCard: !state.useLegacyEntryCard }));
      },
      useLegacyAddEntryMenu: false,
      toggleUseLegacyAddEntryMenu: () => {
        set((state) => ({ useLegacyAddEntryMenu: !state.useLegacyAddEntryMenu }));
      },
      useGoogleBackup: true,
      toggleGoogleBackup: () => {
        set((state) => ({ useGoogleBackup: !state.useGoogleBackup }));
      },
    }),
    {
      name: STORAGE_OPTIONS_KEY,
      storage: chromePersistStorage,
    }
  )
);
