/* eslint-disable react/prop-types */

/**
 * Komponen tabel yang dapat digunakan kembali untuk menampilkan data terstruktur.
 * @param {object} props - Properti komponen.
 * @param {string[]} props.headers - Array string untuk header tabel.
 * @param {(string|React.ReactNode|object)[][]} props.rows - Array dari array, di mana setiap sel bisa berupa string, React component, atau object.
 */

function InfoTable({ headers, rows }) {
  const renderCell = (cell) => {
    // Jika cell adalah object tower { name, image }
    if (
      typeof cell === "object" &&
      cell !== null &&
      "name" in cell &&
      "image" in cell
    ) {
      return (
        <div className="flex items-center gap-4 font-semibold">
          <img
            src={cell.image}
            alt={`${cell.name} Icon`}
            className="h-20 w-20 rounded-md object-cover"
          />
          <span>{cell.name}</span>
        </div>
      );
    }

    // Jika cell adalah React element
    if (typeof cell === "object" && cell !== null) {
      return cell;
    }

    // Jika cell string / angka
    return cell;
  };

  return (
    <div className="not-prose my-8 overflow-x-auto rounded-lg shadow-md">
      <table className="min-w-full border-collapse text-left">
        <thead className="bg-amber-500">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-6 py-3 text-sm font-bold uppercase tracking-wider text-slate-50"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white">
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-gray-200 align-middle transition-colors even:bg-gray-50 hover:bg-orange-100"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-6 py-4 text-sm text-gray-800"
                >
                  {renderCell(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InfoTable;