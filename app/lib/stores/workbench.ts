import { atom } from "nanostores";
import { getPersistedItem, persistAtom } from "../persistence";

export type WorkbenchState = {
  activePanel: "editor" | "terminal" | "preview" | null;
  previewSplit: number;
  terminalSplit: number;
  editorSplit: number;
};

const initial: WorkbenchState = {
  activePanel: "editor",
  previewSplit: 50,
  terminalSplit: 50,
    editorSplit: 50,
};

export const $workbench = atom<WorkbenchState>(
  getPersistedItem("workbench", initial)
);

export const setActivePanel = (panel: WorkbenchState["activePanel"]) => {
  $workbench.set({
    ...$workbench.get(),
    activePanel: panel,
  });
};

export const setPreviewSplit = (split: number) => {
  $workbench.set({
    ...$workbench.get(),
    previewSplit: split,
  });
};

export const setTerminalSplit = (split: number) => {
  $workbench.set({
    ...$workbench.get(),
    terminalSplit: split,
  });
};


export const setEditorSplit = (split: number) => {
  $workbench.set({
    ...$workbench.get(),
    editorSplit: split,
  });
};

persistAtom($workbench, "workbench");
export type WorkbenchStore = typeof $workbench;
