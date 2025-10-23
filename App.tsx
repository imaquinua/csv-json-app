
import React from 'react';
import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { CsvPreview } from './components/CsvPreview';
import { JsonOutput } from './components/JsonOutput';
import { Loader } from './components/Loader';
import { convertCsvToJson } from './services/geminiService';
import { LogoIcon } from './components/Icons';

type ParsedCsvRow = Record<string, string>;

export default function App() {
  const [csvData, setCsvData] = useState<string | null>(null);
  const [parsedCsv, setParsedCsv] = useState<ParsedCsvRow[] | null>(null);
  const [jsonData, setJsonData] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCsvData(text);
        setFileName(file.name);
        previewCsv(text);
        setJsonData(null);
        setError(null);
      };
      reader.onerror = () => {
        setError('Failed to read the file.');
        resetState();
      };
      reader.readAsText(file);
    } else {
      resetState();
    }
  };

  const previewCsv = (text: string) => {
    try {
      const lines = text.trim().split(/\r?\n/);
      if (lines.length < 2) {
        setParsedCsv([]);
        return;
      }
      const headers = lines[0].split(',').map(h => h.trim());
      const previewRows = lines.slice(1, 6).map(line => {
        // A simple parser for preview, not robust for values with commas.
        const values = line.split(',').map(v => v.trim());
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index] || '';
          return obj;
        }, {} as ParsedCsvRow);
      });
      setParsedCsv(previewRows);
    } catch (e) {
      setError('Could not parse CSV for preview. The file might be malformed.');
      setParsedCsv(null);
    }
  };

  const handleConvert = async () => {
    if (!csvData) {
      setError('No CSV data available to convert.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setJsonData(null);
    try {
      const result = await convertCsvToJson(csvData);
      // Pretty-print the JSON for display
      const parsedJson = JSON.parse(result);
      setJsonData(JSON.stringify(parsedJson, null, 2));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Conversion failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setCsvData(null);
    setParsedCsv(null);
    setJsonData(null);
    setFileName(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-3 sm:mb-2">
            <LogoIcon />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 leading-tight">
              Intelligent CSV to JSON Converter
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto px-2">
            Upload your social media report in CSV format. Gemini will analyze the content and convert it into structured JSON.
          </p>
        </header>

        <main className="space-y-4 sm:space-y-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center">
              <FileUpload onFileChange={handleFileChange} fileName={fileName} />
              <div className="flex flex-col sm:flex-row md:flex-col gap-3 sm:gap-4">
                <button
                  onClick={handleConvert}
                  disabled={!csvData || isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg text-sm sm:text-base transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 touch-manipulation"
                >
                  {isLoading ? 'Converting...' : 'Convert to JSON'}
                </button>
                <button
                  onClick={resetState}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg text-sm sm:text-base transition-colors duration-200 active:scale-95 touch-manipulation"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
          
          {error && (
             <div className="bg-red-900/50 border border-red-700 text-red-300 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline break-words">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {parsedCsv && <CsvPreview data={parsedCsv} />}
            {isLoading && (
              <div className="lg:col-span-1 flex items-center justify-center bg-gray-800/50 border border-gray-700 rounded-lg sm:rounded-xl p-4 sm:p-6 min-h-[250px] sm:min-h-[300px]">
                <Loader />
              </div>
            )}
            {jsonData && <JsonOutput data={jsonData} />}
          </div>
        </main>
      </div>
    </div>
  );
}
