import { t } from "@src/chrome/i18n";
import { create } from "zustand";

interface BackupStoreProps {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  jsonData: string | null;
  setJsonData: (value: string) => void;
  infoText: string;
  setInfoText: (value: string) => void;
  isCloseAccion: boolean;
  setCloseAction: (value: boolean) => void;
  showMessage: (message: string, isInfo?: boolean) => void;
}

export const useBackupStore = create<BackupStoreProps>((set) => ({
  isOpen: false,
  setOpen: (value) => set({ isOpen: value }),
  jsonData: null,
  setJsonData: (value) => set({ jsonData: value }),
  infoText: t("importBackupInfo"),
  setInfoText: (value) => set({ infoText: value }),
  isCloseAccion: false,
  setCloseAction: (value) => set({ isCloseAccion: value }),
  showMessage: (message, isInfo = false) => {
    set({ infoText: message, isCloseAccion: isInfo, isOpen: true });
  },
}));
