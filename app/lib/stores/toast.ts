// app/lib/stores/toast.ts
import { create } from "zustand";

interface ToastState {
    message: string | null;
    type: "success" | "error" | "info";
    showToast: ({ message, type }: { message: string, type: "success" | "error" | "info" }) => void;
   clearToast: () => void;
}

export const useToast = create<ToastState>((set) => ({
   message: null,
   type: "info",
   showToast: ({message, type}) => set({message, type}),
    clearToast: () => set({message: null})
}));
