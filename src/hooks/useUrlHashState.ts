import { useEffect } from "react";
import { create } from "zustand";

interface UrlHashStateStore {
  hashState: Record<string, boolean>;
  setHashState: (hash: string, value: boolean) => void;
}

const useUrlHashStateStore = create<UrlHashStateStore>((set) => ({
  hashState: {},
  setHashState: (hash: string, value: boolean) =>
    set((state) => ({ hashState: { ...state.hashState, [hash]: value } })),
}));

type UseUrlHashResp = [state: boolean, toggleState: () => void];

export default function useUrlHashState(hash: string): UseUrlHashResp {
  const { hashState, setHashState } = useUrlHashStateStore();

  const toggleHash = (hash: string) => {
    const pathname = window.location.pathname;
    const newState = !hashState[hash];
    setHashState(hash, newState);
    if (newState) {
      window.history.pushState({}, "", `${pathname}${hash}`);
    } else {
      window.history.pushState({}, "", `${pathname}`);
    }
  };

  useEffect(() => {
    const onHashChange = () => setHashState(hash, window.location.hash === hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [hash, setHashState]);

  return [hashState[hash] ?? false, () => toggleHash(hash)];
}
