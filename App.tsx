
import React from 'react';
import { useState } from 'react';
import Papa from 'papaparse';
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
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            setError('Could not parse CSV for preview. The file might be malformed.');
            setParsedCsv(null);
            return;
          }
          // Show first 5 rows for preview
          const previewRows = (results.data as ParsedCsvRow[]).slice(0, 5);
          setParsedCsv(previewRows);
        },
        error: () => {
          setError('Could not parse CSV for preview. The file might be malformed.');
          setParsedCsv(null);
        }
      });
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
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <LogoIcon />
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Intelligent CSV to JSON Converter
            </h1>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Upload your social media report in CSV format. Gemini will analyze the content and convert it into structured JSON.
          </p>
        </header>

        <main className="space-y-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <FileUpload onFileChange={handleFileChange} fileName={fileName} />
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleConvert}
                  disabled={!csvData || isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                >
                  {isLoading ? 'Converting...' : 'Convert to JSON'}
                </button>
                <button
                  onClick={resetState}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
          
          {error && (
             <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {parsedCsv && <CsvPreview data={parsedCsv} />}
            {isLoading && (
              <div className="lg:col-span-1 flex items-center justify-center bg-gray-800/50 border border-gray-700 rounded-xl p-6 min-h-[300px]">
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
