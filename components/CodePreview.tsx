
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icons';

interface CodePreviewProps {
  code: string;
  onCodeChange: (newCode: string) => void;
  onRegenerate: () => void;
  onSaveFavorite: () => void;
  isLoading: boolean;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ code, onCodeChange, onRegenerate, onSaveFavorite, isLoading }) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(code);

  // Keep ref updated with the latest code to avoid stale closures in intervals/listeners
  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  // Auto-save logic
  useEffect(() => {
    const saveCode = () => {
      // Only save if there's actual code content
      if (codeRef.current && codeRef.current.trim() !== '') {
        localStorage.setItem('ai-website-autosave', codeRef.current);
      }
    };

    // Save every 30 seconds
    const intervalId = setInterval(saveCode, 30000);

    // Save when the tab/window is about to be closed
    window.addEventListener('beforeunload', saveCode);

    // Cleanup function to run when the component unmounts
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', saveCode);
      // Perform a final save on unmount (e.g., when switching tabs in the app)
      saveCode();
    };
  }, []); // Empty dependency array ensures this setup runs only once


  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="space-y-8">
      <div className="bg-white/5 backdrop-blur-xl border border-card-border rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <h2 className="text-3xl font-bold text-accent flex items-center gap-4">
                  <Icon name="Code" className="w-8 h-8"/>
                  Website Builder
              </h2>
              <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                  <button onClick={handleCopy} className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-black/25 hover:bg-primary/80 text-white py-2 px-4 rounded-lg transition-all duration-300">
                      {copied ? <Icon name="Check" className="w-5 h-5 text-success" /> : <Icon name="Copy" className="w-5 h-5"/>}
                      {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button onClick={onRegenerate} disabled={isLoading} className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-black/25 hover:bg-primary/80 text-white py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50">
                      <Icon name="RotateCw" className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}/>
                      Regenerate
                  </button>
                   <button onClick={onSaveFavorite} className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-black/25 hover:bg-warning text-white hover:text-dark py-2 px-4 rounded-lg transition-all duration-300">
                      <Icon name="Star" className="w-5 h-5"/>
                      Favorite
                  </button>
              </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                  <h3 className="text-xl font-semibold text-accent-light mb-4">Code Editor</h3>
                  <textarea
                      value={code}
                      onChange={(e) => onCodeChange(e.target.value)}
                      className="w-full h-[60vh] bg-darker text-gray-300 font-mono text-sm p-4 border border-white/20 rounded-xl focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 resize-none"
                      spellCheck="false"
                  />
              </div>
              <div>
                  <h3 className="text-xl font-semibold text-accent-light mb-4">Live Preview</h3>
                  <iframe
                      srcDoc={code}
                      title="Website Preview"
                      className="w-full h-[60vh] bg-white border border-white/20 rounded-xl"
                      sandbox="allow-scripts"
                  />
              </div>
          </div>
      </div>
    </div>
  );
};
