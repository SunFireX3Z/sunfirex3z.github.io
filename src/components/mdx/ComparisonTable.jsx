/* eslint-disable react/prop-types */

/**
 * Komponen untuk menampilkan sel tabel perbandingan, dengan perlakuan khusus untuk nilai boolean.
 */
function TableCell({ content }) {
  if (content === true) {
    return (
      <div className="flex justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 text-green-500">
          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }

  if (content === false) {
    return (
      <div className="flex justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 text-red-500">
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
        </svg>
      </div>
    );
  }

  return content;
}

/**
 * Komponen untuk menampilkan tabel perbandingan di dalam artikel MDX.
 * @param {object} props - Properti komponen.
 * @param {string[]} props.headers - Array string untuk header tabel.
 * @param {(string|boolean|React.ReactNode)[][]} props.rows - Array dari array, di mana setiap sel bisa berupa string, boolean, atau komponen React.
 */
function ComparisonTable({ headers, rows }) {
  return (
    <div className="not-prose my-8 overflow-x-auto rounded-xl border border-gray-200 shadow-md">
      <table className="min-w-full border-collapse text-left">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header, index) => (
              <th key={index} scope="col" className={`px-6 py-4 text-sm font-bold uppercase tracking-wider text-gray-700 ${index > 0 ? 'text-center' : ''}`}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-200 align-middle transition-colors last:border-none hover:bg-orange-50/50">
              {row.map((cell, cellIndex) => <td key={cellIndex} className={`px-6 py-4 text-gray-800 text-sm ${cellIndex === 0 ? 'font-semibold' : ''}`}><TableCell content={cell} /></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ComparisonTable;