// app/lib/stores/settings.ts

import { create } from 'zustand';
import { Theme } from "@/app/types/theme";
import { workbenchStore } from './workbench';

export interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  ctrlOrMetaKey?: boolean;
  action: () => void;
}

export interface Shortcuts {
  toggleTerminal: Shortcut;
  // add other shortcuts here
}

export interface SettingsState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  shortcuts: Shortcuts;
  setShortcuts: (shortcuts: Shortcuts) => void;
}



export const useSettings = create<SettingsState>((set) => ({
  theme: "light",
  setTheme: (theme) => set({ theme }),
  shortcuts: {
    toggleTerminal: {
      key: 'j',
      ctrlOrMetaKey: true,
      action: () => workbenchStore.toggleTerminal(),
    },
  },
  setShortcuts: (shortcuts) => set({ shortcuts }),
}));
