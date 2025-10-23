
import React from 'react';

type CsvData = Record<string, string>[];

interface CsvPreviewProps {
  data: CsvData;
}

export const CsvPreview: React.FC<CsvPreviewProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-300">CSV Preview</h2>
        <p className="text-sm sm:text-base text-gray-400">No data to display. The uploaded file might be empty or improperly formatted.</p>
      </div>
    );
  }

  const headers = Object.keys(data[0]);

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg overflow-hidden">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-300">CSV Preview (First 5 Rows)</h2>
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <table className="w-full text-sm text-left text-gray-400 min-w-[600px]">
          <thead className="text-xs sm:text-sm text-gray-300 uppercase bg-gray-700/50 sticky top-0">
            <tr>
              {headers.map((header) => (
                <th key={header} scope="col" className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-700 hover:bg-gray-700/30 transition-colors">
                {headers.map((header, colIndex) => (
                  <td key={colIndex} className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 truncate max-w-[120px] sm:max-w-[150px] md:max-w-[200px] text-xs sm:text-sm">
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 mt-3 sm:hidden">Swipe left to see more columns</p>
    </div>
  );
};
