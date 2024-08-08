import { create } from "zustand";

type ModalStoreProps = {
  isOpenModal: {
    modal1: boolean;
    modal2: boolean;
  };
  toggleModal: (modalName: string) => void;
};

export const useModalStore = create<ModalStoreProps>()((set) => ({
  isOpenModal: {
    modal1: false,
    modal2: false,
  },
  toggleModal: (modalName) => {
    set((state) => ({
      isOpenModal: {
        ...state.isOpenModal,
        [modalName]: !state.isOpenModal[modalName],
      },
    }));
  },
}));
