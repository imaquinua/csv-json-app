
import React from 'react';

type CsvData = Record<string, string>[];

interface CsvPreviewProps {
  data: CsvData;
}

export const CsvPreview: React.FC<CsvPreviewProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-300">CSV Preview</h2>
        <p className="text-gray-400">No data to display. The uploaded file might be empty or improperly formatted.</p>
      </div>
    );
  }

  const headers = Object.keys(data[0]);

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-lg overflow-hidden">
      <h2 className="text-xl font-semibold mb-4 text-gray-300">CSV Preview (First 5 Rows)</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
            <tr>
              {headers.map((header) => (
                <th key={header} scope="col" className="px-6 py-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-700 hover:bg-gray-700/30">
                {headers.map((header, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 truncate max-w-[150px]">
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
