/* eslint-disable react/prop-types */
import React from 'react';

/**
 * Komponen untuk menampilkan kotak catatan penting di dalam artikel MDX.
 * @param {object} props - Properti komponen.
 * @param {string} [props.title="Catatan"] - Judul untuk kotak catatan.
 * @param {React.ReactNode} props.children - Konten yang akan ditampilkan di dalam kotak.
 */
function Note({ title = "Catatan", children }) {
  return (
    <div className="not-prose my-8 flex items-start gap-4 rounded-lg border-l-4 border-orange-500 bg-orange-50 p-4 shadow-sm">
      {/* Ikon */}
      <div className="flex-shrink-0 pt-0.5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5 text-orange-500"
        >
          <path d="M17.414 2.586a2 2 0 0 0-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 0 0 0-2.828Z" />
          <path fillRule="evenodd" d="M2 6a2 2 0 0 1 2-2h4a1 1 0 1 1 0 2H4v10h10v-4a1 1 0 1 1 2 0v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6Z" clipRule="evenodd" />
        </svg>
      </div>
      {/* Konten */}
      <div className="w-full">
        <h4 className="not-prose mt-0 mb-2 border-none pl-0 text-base font-bold text-orange-900">{title}</h4>
        <div className="prose prose-sm max-w-none text-orange-800 prose-code:before:content-none prose-code:after:content-none">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Note;