import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, setCode }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto-focus the textarea when component mounts
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleKeyTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      
      // Insert tab at cursor position
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      
      // Move cursor after the inserted tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2;
          textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  return (
    <motion.div 
      className="h-[calc(100vh-16rem)] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative h-full group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <textarea 
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyTab}
          className="w-full h-full bg-transparent resize-none focus:outline-none font-mono text-sm text-gray-100 p-4 leading-relaxed tracking-wide relative z-10"
          placeholder="Enter your code here..."
          spellCheck="false"
          autoComplete="off"
          autoCorrect="off"
          data-gramm="false"
          style={{ caretColor: '#fff' }}
        />
        <div className="absolute left-3 bottom-3 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800/70 px-2 py-1 rounded">
          Line count: {code.split('\n').length}
        </div>
      </div>
    </motion.div>
  );
};

export default CodeEditor;