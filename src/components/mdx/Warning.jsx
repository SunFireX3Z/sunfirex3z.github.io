/* eslint-disable react/prop-types */

/**
 * Komponen untuk menampilkan kotak peringatan di dalam artikel MDX.
 * @param {object} props - Properti komponen.
 * @param {string} [props.title="Peringatan"] - Judul untuk kotak peringatan.
 * @param {React.ReactNode} props.children - Konten yang akan ditampilkan di dalam kotak.
 */
function Warning({ title = "Peringatan", children }) {
  return (
    <div className="not-prose my-8 flex items-start gap-4 rounded-lg border-l-4 border-red-500 bg-red-50 p-4 shadow-sm">
      {/* Ikon */}
      <div className="flex-shrink-0 pt-0.5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5 text-red-500"
        >
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      {/* Konten */}
      <div className="w-full">
        <h4 className="not-prose mt-0 mb-2 border-none pl-0 text-base font-bold text-red-900">{title}</h4>
        <div className="prose prose-sm max-w-none text-red-800">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Warning;