
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
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-lg relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-300">JSON Output</h2>
        <div className="flex gap-2">
          <button onClick={handleCopy} className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors" aria-label="Copy JSON">
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
          <button onClick={handleDownload} className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors" aria-label="Download JSON">
            <DownloadIcon />
          </button>
        </div>
      </div>
      <pre className="bg-gray-900/70 rounded-lg p-4 overflow-auto max-h-[400px] text-sm text-cyan-300">
        <code>{data}</code>
      </pre>
    </div>
  );
};
