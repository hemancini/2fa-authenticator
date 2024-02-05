import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface OptionsStore {
    themeMode: ThemeMode;
    toggleThemeMode: (mode: ThemeMode) => void;
    themeColor: string;
    toggleThemeColor: (color: string) => void;
};

export const useOptionsStore = create<OptionsStore>()(
    persist(
        (set) => ({
            themeMode: 'system',
            toggleThemeMode: (mode) => {
                set({ themeMode: mode });
            },
            themeColor: 'green',
            toggleThemeColor: (color) => {
                set({ themeColor: color });
            },
        }),
        {
            name: '2fa-options', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        }
    )
);