import { atom } from "nanostores";
import { getPersistedItem, persistAtom } from "../persistence";

export type Auth = {
  token?: string;
  isLoggedIn: boolean;
};

const initial: Auth = {
  isLoggedIn: false,
};

export const $auth = atom<Auth>(getPersistedItem("auth", initial));

export const setAuth = (auth: Auth) => {
  $auth.set(auth);
};

persistAtom($auth, "auth");
