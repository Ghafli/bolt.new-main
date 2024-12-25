import { atom } from "nanostores";
import { Theme } from "@/app/types/theme";
import { getPersistedItem, persistAtom } from "../persistence";

export const $theme = atom<Theme>(getPersistedItem("theme", "dark") as Theme);

export const setTheme = (theme: Theme) => {
    $theme.set(theme);
}

persistAtom($theme, "theme");
