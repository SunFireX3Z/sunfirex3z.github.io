/* eslint-disable react/prop-types */
import React, { useState } from 'react';

/**
 * Komponen untuk satu item pertanyaan dan jawaban dalam FAQ.
 * @param {object} props - Properti komponen.
 * @param {string} props.title - Judul pertanyaan.
 * @param {React.ReactNode} props.children - Konten jawaban.
 */
export function FAQItem({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left font-semibold text-gray-800 transition-colors hover:text-orange-500"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <svg
          className={`h-5 w-5 flex-shrink-0 transform text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="pb-5">
            <div className="prose prose-sm max-w-none border-l-4 border-amber-500 pl-6 text-gray-600">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Komponen pembungkus untuk daftar FAQ.
 * @param {object} props - Properti komponen.
 * @param {React.ReactNode} props.children - Kumpulan komponen FAQItem.
 */
function FAQ({ children }) {
  return (
    <div className="not-prose my-12">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions (FAQ)</h2>
      <div className="rounded-lg bg-white shadow-md">
        <div className="divide-y divide-gray-200 px-6">{children}</div>
      </div>
    </div>
  );
}

export default FAQ;