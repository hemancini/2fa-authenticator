import { create } from "zustand";

export const useAddType = create<UseAddTypeProps>((set) => ({
  addType: undefined,
  setAddType: (value) => set({ addType: value, successMessage: "" }),
  successMessage: "",
  setSuccessMessage: (value) => set({ successMessage: value }),
}));
