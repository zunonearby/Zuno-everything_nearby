import { create } from "zustand";

interface UserRegistrationState {
  fullName: string;
  email: string;
  phone: string;
  setRegistrationDetails: (details: { fullName?: string; email?: string; phone?: string }) => void;
  clearRegistrationDetails: () => void;
}

export const useUserRegistrationStore = create<UserRegistrationState>((set) => ({
  fullName: "",
  email: "",
  phone: "",
  setRegistrationDetails: (details) => set((state) => ({ ...state, ...details })),
  clearRegistrationDetails: () => set({ fullName: "", email: "", phone: "" }),
}));
