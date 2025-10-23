
import React from 'react';
import { useState, useEffect } from 'react';
import { CopyIcon, DownloadIcon, CheckIcon } from './Icons';

interface JsonOutputProps {
  data: string;
}

export const JsonOutput: React.FC<JsonOutputProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(data).then(() => {
      setCopied(true);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-3 sm:gap-2">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-300">JSON Output</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleCopy}
            className="flex-1 sm:flex-none p-2 sm:p-2.5 rounded-md bg-gray-700 hover:bg-gray-600 active:bg-gray-500 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Copy JSON"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 sm:flex-none p-2 sm:p-2.5 rounded-md bg-gray-700 hover:bg-gray-600 active:bg-gray-500 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Download JSON"
          >
            <DownloadIcon />
          </button>
        </div>
      </div>
      <pre className="bg-gray-900/70 rounded-lg p-3 sm:p-4 overflow-auto max-h-[300px] sm:max-h-[400px] md:max-h-[500px] text-xs sm:text-sm text-cyan-300 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <code className="break-all sm:break-normal whitespace-pre-wrap sm:whitespace-pre">{data}</code>
      </pre>
    </div>
  );
};
