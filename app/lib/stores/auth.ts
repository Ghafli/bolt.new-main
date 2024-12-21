// app/lib/stores/auth.ts
import { create } from "zustand";

interface User {
  username: string;
}
interface AuthState {
    user: User | null;
    signUp: ({username, password}: { username: string, password: string }) => Promise<void>;
    signIn: ({username, password}: { username: string, password: string }) => Promise<void>;
    signOut: () => Promise<void>;
}

const AUTH_STORAGE_KEY = "auth-user"

export const useAuth = create<AuthState>((set) => ({
     user: localStorage.getItem(AUTH_STORAGE_KEY) ? JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)!) : null,
    signUp: async ({username, password}) => {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({username}))
         set({user: {username}})
    },
    signIn: async ({username, password}) => {
           localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({username}))
            set({user: {username}})
    },
    signOut: async () => {
           localStorage.removeItem(AUTH_STORAGE_KEY);
           set({ user: null });
    },
}));
