import { atom } from "nanostores";
import { getPersistedItem, persistAtom } from "../persistence";

export type EditorState = {
  activeFile?: {
    path: string;
    content: string;
    mimeType: string;
  };
};

const initial: EditorState = {};

export const $editor = atom<EditorState>(getPersistedItem("editor", initial));

export const openFile = (file: EditorState["activeFile"]) => {
  $editor.set({
    ...$editor.get(),
    activeFile: file,
  });
};

export const closeFile = () => {
  $editor.set({
    ...$editor.get(),
    activeFile: undefined,
  });
};

export const updateFileContent = (content: string) => {
  const activeFile = $editor.get().activeFile;
  if (activeFile) {
    $editor.set({
      ...$editor.get(),
      activeFile: {
        ...activeFile,
        content,
      },
    });
  }
};

persistAtom($editor, "editor");
export type EditorStore = typeof $editor;
