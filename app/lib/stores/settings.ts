import { atom } from "nanostores";
import { getPersistedItem, persistAtom } from "../persistence";
import { Theme } from "@/app/types/theme";

export type SettingsState = {
  theme: Theme;
  chatSidebarOpen: boolean;
};

const initial: SettingsState = {
    theme: "dark",
    chatSidebarOpen: false,
};

export const $settings = atom<SettingsState>(getPersistedItem("settings", initial));

export const setTheme = (theme: Theme) => {
  $settings.set({
    ...$settings.get(),
    theme,
  });
};

export const setChatSidebarOpen = (open: boolean) => {
    $settings.set({
      ...$settings.get(),
      chatSidebarOpen: open
    })
}

persistAtom($settings, "settings");

export type SettingsStore = typeof $settings;
