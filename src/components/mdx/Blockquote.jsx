/* eslint-disable react/prop-types */

/**
 * Komponen untuk menampilkan kutipan (blockquote) dengan gaya yang menarik.
 * @param {object} props - Properti komponen.
 * @param {React.ReactNode} props.children - Isi kutipan (teks).
 * @param {string} [props.author] - Penulis kutipan (opsional).
 * @param {string} [props.source] - Sumber kutipan, misal: nama buku atau website (opsional).
 */
function Blockquote({ children, author, source }) {
  return (
    <blockquote className="not-prose my-8 border-l-4 border-orange-400 bg-orange-50 p-6 rounded-r-lg shadow-sm">
      <div className="relative pt-4">
        <svg className="absolute -top-4 -left-4 h-10 w-10 text-orange-200" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
          <path d="M9.33 6.41C5.83 9.41 4 13.41 4 17.41v5h10v-10H8.33c.5-2.5 1.67-4.5 3.67-6l-2.67-2.59zM22.33 6.41A13.33 13.33 0 0017 17.41v5h10v-10h-5.67c.5-2.5 1.67-4.5 3.67-6l-2.67-2.59z" />
        </svg>
        <div className="text-lg italic text-gray-700">
          {children}
        </div>
      </div>
      {(author || source) && (
        <footer className="mt-2 text-right">
            {author && (
                <div className="font-semibold">
                    — {author}
                </div>
            )}
            {source && (
                <cite className="block text-sm text-gray-500">
                    {source}
                </cite>
            )}
        </footer>
      )}
    </blockquote>
  );
}

export default Blockquote;