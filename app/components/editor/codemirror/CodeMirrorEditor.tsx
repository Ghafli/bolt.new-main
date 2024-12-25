import {
  type ChangeSpec,
  EditorState,
  Extension,
  StateEffect,
} from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import {
  Compartment,
  Prec,
  type Facet,
  type MapMode,
} from "@codemirror/state";
import {
  defaultKeymap,
  indentWithTab,
  type KeyBinding,
} from "@codemirror/commands";
import {
  bracketMatching,
  closeBrackets,
  closeBracketsKeymap,
  indentOnInput,
  syntaxHighlighting,
} from "@codemirror/language";
import { languages } from "./languages";
import { cmTheme } from "./cm-theme";
import { indent } from "./indent";
import { useStore } from "~/lib/stores";
import { useEffect, useRef, useState } from "react";
import { classNames } from "~/utils/classNames";

interface CodeMirrorEditorProps {
  value?: string;
  language?: string;
  onUpdate?: (value: string) => void;
  className?: string;
  readOnly?: boolean;
  lineWrapping?: boolean;
  tabSize?: number;
}

const languageCompartment = new Compartment();
const tabSizeCompartment = new Compartment();
const readOnlyCompartment = new Compartment();
const lineWrappingCompartment = new Compartment();

export function CodeMirrorEditor({
  value = "",
  language = "plaintext",
  onUpdate,
  className,
  readOnly = false,
  lineWrapping = false,
  tabSize = 2,
}: CodeMirrorEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView>();
  const [isReady, setIsReady] = useState(false);
  const { editor } = useStore();

  useEffect(() => {
    if (!editorRef.current || viewRef.current) {
      return;
    }

    const extensions: Extension[] = [
      cmTheme,
      Prec.fallback(defaultKeymap),
      keymap.of([indentWithTab]),
      indent(),
      closeBrackets(),
      closeBracketsKeymap,
      bracketMatching(),
      indentOnInput(),
      syntaxHighlighting(),
    ];
    const view = new EditorView({
      state: EditorState.create({
        doc: value,
        extensions,
      }),
      parent: editorRef.current,
    });

    viewRef.current = view;

    setIsReady(true);

    return () => {
      view.destroy();
      viewRef.current = undefined;
      setIsReady(false);
    };
  }, []);

  // Language
  useEffect(() => {
    if (!viewRef.current || !isReady) return;
    const lang = languages[language];

    if (!lang) return;

    viewRef.current.dispatch({
      effects: languageCompartment.reconfigure(lang),
    });
  }, [language, isReady]);

  // Value
  useEffect(() => {
    if (!viewRef.current || !isReady) return;
    if (viewRef.current.state.doc.toString() === value) return;

    viewRef.current.dispatch({
      changes: {
        from: 0,
        to: viewRef.current.state.doc.length,
        insert: value,
      },
    });
  }, [value, isReady]);

  // Tab Size
  useEffect(() => {
    if (!viewRef.current || !isReady) return;

    viewRef.current.dispatch({
      effects: tabSizeCompartment.reconfigure(
        EditorState.tabSize.of(tabSize),
      ),
    });
  }, [tabSize, isReady]);

  // ReadOnly
  useEffect(() => {
    if (!viewRef.current || !isReady) return;

    viewRef.current.dispatch({
      effects: readOnlyCompartment.reconfigure(EditorView.editable.of(!readOnly)),
    });
  }, [readOnly, isReady]);


  // LineWrapping
  useEffect(() => {
    if (!viewRef.current || !isReady) return;
    viewRef.current.dispatch({
      effects: lineWrappingCompartment.reconfigure(EditorView.lineWrapping.of(lineWrapping)),
    });

  },[lineWrapping, isReady])



  // Update callback
  useEffect(() => {
    if (!viewRef.current || !isReady) return;

    const handleUpdate = () => {
      const doc = viewRef.current?.state.doc.toString();
      if (doc && onUpdate) {
        onUpdate(doc);
      }
    };
    viewRef.current.update(handleUpdate);

    viewRef.current.focus();
  }, [onUpdate, isReady]);

  useEffect(() => {
    if(viewRef.current && isReady){
      editor.setEditorView(viewRef.current);
    }
  }, [editor, isReady])


  return <div ref={editorRef} className={classNames("h-full", className)} />;
}
