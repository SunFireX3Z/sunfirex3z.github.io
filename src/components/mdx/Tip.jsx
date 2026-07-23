/* eslint-disable react/prop-types */

/**
 * Komponen untuk menampilkan kotak tips atau informasi penting di dalam artikel MDX.
 * @param {object} props - Properti komponen.
 * @param {string} [props.title="Tips"] - Judul untuk kotak tips.
 * @param {React.ReactNode} props.children - Konten yang akan ditampilkan di dalam kotak.
 */
function Tip({ title = "Tips", children }) {
  return (
    <div className="not-prose my-8 flex items-start gap-4 rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4 shadow-sm">
      {/* Ikon */}
      <div className="flex-shrink-0 pt-0.5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5 text-amber-500"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      {/* Konten */}
      <div className="w-full">
        <h4 className="not-prose mt-0 mb-2 border-none pl-0 text-base font-bold text-amber-500">{title}</h4>
        <div className="prose prose-sm max-w-none text-amber-700">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Tip;