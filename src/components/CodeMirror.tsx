
import { useEffect, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';

interface CodeMirrorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
}

const CodeMirror = ({ value, onChange, language }: CodeMirrorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Clean up previous editor instance
    if (viewRef.current) {
      viewRef.current.destroy();
    }

    // Choose language extension based on selected language
    let languageExtension;
    switch (language) {
      case 'c':
      case 'cpp':
        languageExtension = cpp();
        break;
      case 'java':
        languageExtension = java();
        break;
      case 'python':
        languageExtension = python();
        break;
      case 'javascript':
      case 'js':
        languageExtension = javascript();
        break;
      case 'html':
        languageExtension = html();
        break;
      default:
        languageExtension = cpp(); // Default to C++
    }

    // Create editor with selected language and theme
    const view = new EditorView({
      state: EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          languageExtension,
          oneDark,
          EditorView.updateListener.of(update => {
            if (update.docChanged) {
              onChange(update.state.doc.toString());
            }
          })
        ]
      }),
      parent: editorRef.current
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, [language]); // Recreate editor when language changes

  // Update editor value when prop changes and value doesn't match
  useEffect(() => {
    const view = viewRef.current;
    if (view && view.state.doc.toString() !== value) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: value }
      });
    }
  }, [value]);

  return <div ref={editorRef} className="h-full w-full" />;
};

export default CodeMirror;
