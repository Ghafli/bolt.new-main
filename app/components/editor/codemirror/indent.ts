import { Extension } from "@codemirror/state";
import { indentUnit } from "@codemirror/language";

export const indent: Extension = [
  indentUnit.of("  "),
];
