import { EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";

export const baseTheme: Extension = EditorView.theme({
  "&": {
    height: "100%",
    overflow: "auto",
    fontFamily: "var(--font-mono)",
  },
  ".cm-scroller": {
    overflow: "auto",
  },
  ".cm-line": {
    paddingLeft: "1rem",
    paddingRight: "1rem",
  },
  ".cm-content": {
    caretColor: "var(--color-text-1)",
  },
  ".cm-gutters": {
    backgroundColor: "var(--color-bg-2)",
    color: "var(--color-text-4)",
    border: "none",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "var(--color-bg-3)",
  },
  ".cm-selectionBackground": {
    backgroundColor: "var(--color-bg-3)",
  },
  ".cm-focused .cm-selectionBackground": {
    backgroundColor: "var(--color-bg-3)",
  },
  ".cm-cursor": {
    borderLeftColor: "var(--color-text-1)",
  },
  ".cm-activeLine": {
    backgroundColor: "var(--color-bg-2)",
  },
});
