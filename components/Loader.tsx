
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      <p className="text-lg text-gray-300">Gemini is thinking...</p>
    </div>
  );
};
