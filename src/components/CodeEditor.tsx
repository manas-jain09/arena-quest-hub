
import { Editor } from '@monaco-editor/react';
import React from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, language }) => {
  // Map language to monaco language IDs
  const getLanguageMode = () => {
    switch (language) {
      case 'c': return 'c';
      case 'cpp': return 'cpp';
      case 'java': return 'java';
      case 'python': return 'python';
      default: return 'javascript';
    }
  };

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        defaultLanguage={getLanguageMode()}
        value={code}
        onChange={(value) => onChange(value || '')}
        theme="light"
        options={{
          fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
          fontSize: 14,
          lineHeight: 21,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          renderLineHighlight: 'all',
          cursorBlinking: 'smooth',
          automaticLayout: true,
          padding: { top: 10 },
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            useShadows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10
          }
        }}
      />
    </div>
  );
};
