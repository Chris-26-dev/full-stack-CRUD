import { create } from "zustand";

interface UserDialogState {
    isOpen: boolean;
    openDialog: () => void;
    closeDialog: () => void;
}

export const useOpenDialogForm = create<UserDialogState>((set) => ({
  isOpen: false,
  openDialog: () => set((state) => ({ isOpen: !state.isOpen })),
  closeDialog: () => set({ isOpen: false }),
}));

