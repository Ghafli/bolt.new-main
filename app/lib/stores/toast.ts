import { atom } from "nanostores";
import { v4 } from "uuid";

export type ToastMessage = {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
};

export type ToastState = {
  messages: ToastMessage[];
};

const initial: ToastState = {
  messages: [],
};

export const $toast = atom<ToastState>(initial);

export const addToast = (message: Omit<ToastMessage, 'id'>) => {
    $toast.set({
        ...$toast.get(),
        messages: [...$toast.get().messages, { ...message, id: v4() }]
    })
};


export const removeToast = (id: string) => {
    $toast.set({
        ...$toast.get(),
        messages: $toast.get().messages.filter(message => message.id !== id)
    })
}

export type ToastStore = typeof $toast;
