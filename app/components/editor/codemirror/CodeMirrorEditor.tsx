// app/components/CodeMirrorEditor/CodeMirrorEditor.tsx
import React, { useState, useRef, useEffect } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState, Transaction } from "@codemirror/state";
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
import { syntaxTree } from "@codemirror/language";

interface CodeMirrorEditorProps {
    language: string;
    value: string;
}
const CodeMirrorEditor: React.FC<CodeMirrorEditorProps> = ({ language, value }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [editorView, setEditorView] = useState<EditorView | null>(null);
    const { theme } = useTheme();
    const { setCode } = useEditor();

    const renameSymbol = (view: EditorView) => {
        const pos = view.state.selection.main.head;
        const tree = syntaxTree(view.state);
        const node = tree.resolveInner(pos, -1);

        if (!node || node.type.name !== "VariableDefinition" && node.type.name !== "PropertyName" && node.type.name !== "Variable") {
            return false;
        }

        const symbolName = view.state.doc.sliceString(node.from, node.to);
         const newName = prompt(`Rename ${symbolName} to:`);

        if (!newName) {
            return false;
        }

        const changes = [];
        tree.iterate({
            enter: (node) => {
                 if (node.type.name === "VariableDefinition" || node.type.name === "PropertyName" || node.type.name === "Variable") {
                      const currentSymbol = view.state.doc.sliceString(node.from, node.to);
                     if(currentSymbol === symbolName){
                         changes.push({ from: node.from, to: node.to, insert: newName });
                     }
                 }
            },
        });

           view.dispatch({ changes, annotations: [Transaction.userEvent.of('renameSymbol')] })
             return true;
    };
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
                keymap.of([{key: "Ctrl-Shift-r", run: renameSymbol}]),
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        setCode(update.state.doc.toString());
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
    }, [language, theme, value, setCode]);

    return <div ref={editorRef} style={{ height: "100%" }}></div>;
};

export default CodeMirrorEditor;
