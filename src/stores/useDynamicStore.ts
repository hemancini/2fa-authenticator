import { create } from "zustand";

type ModalStoreProps = {
  modal: {
    modal1: boolean;
    modal2: boolean;
  };
  toggleModal: (modalName: string) => void;
};

export const useModalStore = create<ModalStoreProps>()((set) => ({
  modal: {
    modal1: false,
    modal2: false,
  },
  toggleModal: (modalName) => {
    set((state) => ({
      modal: {
        ...state.modal,
        [modalName]: !state.modal[modalName],
      },
    }));
  },
}));

type ActionStoreProps = {
  actionState: {
    action1: boolean;
    action2: boolean;
  };
  /**
   * @deprecated since version 1.3.0
   */
  toggleAction: (actionName: string) => void;
};

export const useActionStore = create<ActionStoreProps>((set) => ({
  actionState: {
    action1: false,
    action2: false,
  },
  toggleAction: (actionName) => {
    set((state) => ({
      actionState: {
        ...state.actionState,
        [actionName]: !state.actionState[actionName],
      },
    }));
  },
}));
