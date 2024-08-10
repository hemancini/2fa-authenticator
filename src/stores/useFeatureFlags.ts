import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface FeatureFlagsStore {
  useLegacy: boolean;
  entrustBypass: boolean;
  visibleTokens: boolean;
  // set values for the feature flags
  fetchFeatureFlags: () => Promise<void>;
}

export const useFeatureFlags = create(
  persist<FeatureFlagsStore>(
    (set) => ({
      useLegacy: false,
      entrustBypass: true,
      visibleTokens: true,
      fetchFeatureFlags: async () => {
        const response = await fetch(import.meta.env.VITE_FEATURE_FLAGS_URI_, { cache: "no-store" });
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
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
