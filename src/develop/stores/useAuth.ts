import superjson from "superjson";
import { create } from "zustand";
import { persist, type PersistStorage } from "zustand/middleware";

interface AuthState {
  token: string | undefined;
  setToken: (token: string) => void;
}

export const chromePersistStorage: PersistStorage<AuthState> = {
  getItem: async (name) =>
    await chrome.storage.session.get([name]).then((result) => {
      if (!result[name]) return null;
      return superjson.parse(result[name]);
    }),
  setItem: (name, value) => {
    const stringified = superjson.stringify(value);
    chrome.storage.session.set({ [name]: stringified });
  },
  removeItem: (name) => chrome.storage.session.remove([name]),
};

export const useAuth = create(
  persist<AuthState>(
    (set) => ({
      token: undefined,
      setToken: (token) => set({ token }),
    }),
    {
      name: "auth",
      storage: chromePersistStorage,
    }
  )
);
