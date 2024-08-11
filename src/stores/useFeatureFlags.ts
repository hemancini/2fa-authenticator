import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";

interface FeatureFlagsStore {
  useLegacy: boolean;
  entrustBypass: boolean;
  visibleTokens: boolean;
  // set values for the feature flags
  fetchFeatureFlags: () => Promise<void>;
}

const chromePersistStorage: PersistStorage<FeatureFlagsStore> = {
  getItem: async (name) => await chrome.storage.session.get([name]).then((result) => result[name]),
  setItem: (name, value) => chrome.storage.session.set({ [name]: value }),
  removeItem: (name) => chrome.storage.session.remove([name]),
};

export const useFeatureFlags = create(
  persist<FeatureFlagsStore>(
    (set) => ({
      useLegacy: false,
      entrustBypass: true,
      visibleTokens: true,
      fetchFeatureFlags: async () => {
        const response = await fetch(import.meta.env.VITE_FEATURE_FLAGS_URI, { cache: "no-store" });
        const featureFlags = await response.json();
        // console.log(featureFlags);
        set((state) => {
          const {
            useLegacy = state.useLegacy,
            entrustBypass = state.entrustBypass,
            visibleTokens = state.visibleTokens,
          } = featureFlags ?? {};

          return { entrustBypass, useLegacy, visibleTokens };
        });
      },
    }),
    {
      name: "feature-flags",
      storage: chromePersistStorage,
    }
  )
);
