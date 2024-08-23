import { create } from "zustand";

interface ModalStoreProps {
  isOpenModal: Record<string, boolean>;
  toggleModal: (modalName: string) => void;
}

export const useModalStore = create<ModalStoreProps>()((set) => ({
  isOpenModal: {},
  toggleModal: (modalName) => {
    set((state) => ({
      isOpenModal: {
        ...state.isOpenModal,
        [modalName]: !state.isOpenModal[modalName],
      },
    }));
  },
}));
