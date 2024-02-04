import { create } from 'zustand';

type useModalStoreProps = {
    modals: {
        modal1: boolean;
        modal2: boolean;
    };
    toggleModal: (modalName: string) => void;
};

export const useModalStore = create<useModalStoreProps>(
    (set) => ({
        modals: {
            modal1: false,
            modal2: false,
        },
        toggleModal: (modalName) => {
            set((state) => ({
                modals: {
                    ...state.modals,
                    [modalName]: !state.modals[modalName],
                },
            }));
        },
    })
);
