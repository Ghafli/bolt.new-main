// app/components/CodeMirrorEditor/CodeMirrorEditor.tsx

import React, { useState, useRef, useEffect } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { oneDark } from "./cm-theme";
import { indentWithTab } from "./indent";
import { useTheme } from "@/app/lib/stores/theme";
import { useEditor } from "@/app/lib/stores/editor";
import { languages } from "./languages";
import { autocompletion, completionKeymap } from "@codemirror/autocomplete";
import { keymap } from "@codemirror/view";

interface CodeMirrorEditorProps {
    language: string;
    value: string;
    onChange?: (value: string) => void;
}
const CodeMirrorEditor: React.FC<CodeMirrorEditorProps> = ({ language, value, onChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [editorView, setEditorView] = useState<EditorView | null>(null);
    const { theme } = useTheme();
    const { setCode } = useEditor();

    useEffect(() => {
        if (!editorRef.current) {
            return;
        }
           let selectedLanguage = languages.find((lang) => lang.name === language);

        const startState = EditorState.create({
            doc: value,
            extensions: [
                basicSetup,
                selectedLanguage?.extension || javascript(),
                theme === "dark" ? oneDark : [],
                indentWithTab,
                keymap.of(completionKeymap),
                autocompletion(),
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        setCode(update.state.doc.toString());
                        onChange?.(update.state.doc.toString());
                    }
                }),
            ],
        });
        const view = new EditorView({ state: startState, parent: editorRef.current });
        setEditorView(view);
        return () => {
            view.destroy();
            setEditorView(null);
        };
    }, [language, theme, value, setCode, onChange]);

    return <div ref={editorRef} style={{ height: "100%" }}></div>;
};

export default CodeMirrorEditor;
