import {
  FunctionComponent,
  createRef,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  EditorView,
  highlightActiveLine,
  keymap,
  lineNumbers,
  rectangularSelection,
} from "@codemirror/view";

import { indentWithTab } from "@codemirror/commands";
import { syntaxHighlighting } from "@codemirror/language";

import {
  oneDarkHighlightStyle,
  oneDarkTheme,
} from "@codemirror/theme-one-dark";
import { Compartment, EditorState } from "@codemirror/state";
import { language } from "./languages";
import { indent } from "./indent";
import { useTheme } from "~/app/lib/stores/theme";
import { useEditorStore } from "~/app/lib/stores/editor";
import { useFileStore } from "~/app/lib/stores/files";
import { BinaryContent } from "./BinaryContent";
import { isTextOrBinary } from "~/types/istextorbinary";

export interface Props {
  file: string;
}

const CodeMirrorEditor: FunctionComponent<Props> = ({ file }) => {
  const editorRef = createRef<HTMLDivElement>();
  const [view, setView] = useState<EditorView | null>(null);
  const { theme } = useTheme();
  const { code, setCode, cursor, setCursor } = useEditorStore();
  const { files, getFileContent } = useFileStore();

  const currentFileContent = useMemo(() => {
    return files[file]?.content ?? "";
  }, [files, file]);

  const fileType = useMemo(() => {
    return files[file]?.type ?? "text/plain";
  }, [files, file]);

  const isBinary = useMemo(() => {
    return !isTextOrBinary(fileType);
  }, [fileType]);

  const languageCompartment = useMemo(() => new Compartment(), []);
  const themeCompartment = useMemo(() => new Compartment(), []);

  useEffect(() => {
    if (!editorRef.current) return;

    const startState = EditorState.create({
      doc: currentFileContent,
      selection: cursor,
      extensions: [
        lineNumbers(),
        indent(),
        rectangularSelection(),
        highlightActiveLine(),
        keymap.of([indentWithTab]),
        syntaxHighlighting(oneDarkHighlightStyle, { fallback: true }),
        languageCompartment.of(language(fileType)),
        themeCompartment.of(theme === "dark" ? oneDarkTheme : []),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setCode(update.state.doc.toString());
          }
          if (update.selectionSet) {
            setCursor(update.state.selection);
          }
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });
    setView(view);

    return () => {
      view.destroy();
    };
  }, [
    editorRef,
    fileType,
    languageCompartment,
    themeCompartment,
    setCode,
    setCursor,
    cursor,
    theme,
    currentFileContent,
  ]);

  useEffect(() => {
    if (!view) return;

    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: currentFileContent,
      },
      selection: cursor,
    });
  }, [view, currentFileContent, cursor]);

  useEffect(() => {
    if (!view) return;
    view.dispatch({
      effects: languageCompartment.reconfigure(language(fileType)),
    });
  }, [view, fileType, languageCompartment]);

  useEffect(() => {
    if (!view) return;
    view.dispatch({
      effects: themeCompartment.reconfigure(theme === "dark" ? oneDarkTheme : []),
    });
  }, [view, theme, themeCompartment]);

  useEffect(() => {
    if (code === currentFileContent) return;
    if (!view) return;

    // if the change came from the outside, update the editor
    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: currentFileContent,
      },
      selection: cursor,
    });
  }, [view, code, currentFileContent, cursor]);

  if (isBinary) {
    return (
      <BinaryContent
        content={getFileContent(file) as ArrayBuffer}
        mimeType={fileType}
      />
    );
  }

  return <div className="h-full" ref={editorRef} />;
};

export default CodeMirrorEditor;
