
import React from 'react';
import { useState, useRef } from 'react';
import { UploadIcon } from './Icons';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  fileName: string | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, fileName }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (files[0].type === 'text/csv') {
        onFileChange(files[0]);
      } else {
        alert('Please upload a valid .csv file.');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileChange(files[0]);
    } else {
      onFileChange(null);
    }
  };
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200
        ${isDragging ? 'border-purple-500 bg-gray-700' : 'border-gray-600 hover:border-purple-500 hover:bg-gray-700/50'}`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".csv"
        className="hidden"
      />
      <div className="flex flex-col items-center text-center">
        <UploadIcon />
        {fileName ? (
          <>
            <p className="mt-2 text-lg font-semibold text-green-400">File Selected:</p>
            <p className="text-sm text-gray-300 break-all">{fileName}</p>
          </>
        ) : (
          <>
            <p className="mt-2 text-lg font-semibold text-gray-300">Drag & drop a CSV file here</p>
            <p className="text-sm text-gray-500">or click to select a file</p>
          </>
        )}
      </div>
    </div>
  );
};
