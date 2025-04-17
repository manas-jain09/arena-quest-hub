
import React, { useEffect, useRef } from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, language }) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // In a real implementation, you would integrate a code editor like Monaco or CodeMirror
  // For this demo, we'll use a styled textarea
  
  // Map language to syntax highlighting (would be handled by the editor library)
  const getLanguageMode = () => {
    switch (language) {
      case 'c': return 'c';
      case 'cpp': return 'cpp';
      case 'java': return 'java';
      case 'python': return 'python';
      default: return 'javascript';
    }
  };

  // Tab handling for textarea (basic indentation support)
  useEffect(() => {
    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && editorRef.current === document.activeElement) {
        e.preventDefault();
        const start = editorRef.current.selectionStart;
        const end = editorRef.current.selectionEnd;
        
        // Set textarea value to: text before caret + tab + text after caret
        editorRef.current.value = editorRef.current.value.substring(0, start) + '    ' + editorRef.current.value.substring(end);
        
        // Put caret at right position again
        editorRef.current.selectionStart = editorRef.current.selectionEnd = start + 4;
        
        // Trigger onChange
        onChange(editorRef.current.value);
      }
    };
    
    window.addEventListener('keydown', handleTab);
    return () => window.removeEventListener('keydown', handleTab);
  }, [onChange]);

  return (
    <div className="h-full w-full relative bg-gray-900 text-white">
      <textarea
        ref={editorRef}
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="h-full w-full resize-none bg-gray-900 text-white font-mono p-4 focus:outline-none"
        spellCheck="false"
        data-language={getLanguageMode()}
      />
    </div>
  );
};
