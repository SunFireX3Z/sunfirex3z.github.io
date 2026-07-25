/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react';

/**
 * Komponen untuk satu item pertanyaan dan jawaban dalam FAQ.
 * Didesain untuk digunakan di dalam komponen <FAQ>.
 * @param {object} props - Properti komponen.
 * @param {string} props.title - Judul pertanyaan.
 * @param {React.ReactNode} props.children - Konten jawaban.
 */
export function FAQItem({ title, children }) {
  return (
    <div className="faq-item">
      <button
        className="flex w-full items-center justify-between py-5 text-left font-semibold text-gray-800 transition-colors hover:text-orange-500"
        aria-expanded="false"
        data-faq-toggle
      >
        <span>{title}</span>
        <svg
          className="h-5 w-5 flex-shrink-0 transform text-gray-400 transition-transform duration-300"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          data-faq-icon
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className="grid overflow-hidden transition-all duration-300 ease-in-out grid-rows-[0fr] opacity-0"
        data-faq-content
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
 * Komponen ini mengelola state buka/tutup untuk semua FAQItem di dalamnya.
 * @param {object} props - Properti komponen.
 * @param {React.ReactNode} props.children - Kumpulan komponen FAQItem.
 */
function FAQ({ children }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = Array.from(container.querySelectorAll('.faq-item'));
    let openIndex = -1;

    const closeItem = (item) => {
        const content = item.querySelector('[data-faq-content]');
        const icon = item.querySelector('[data-faq-icon]');
        const toggle = item.querySelector('[data-faq-toggle]');
        content.classList.remove('grid-rows-[1fr]', 'opacity-100');
        content.classList.add('grid-rows-[0fr]', 'opacity-0');
        icon?.classList.remove('rotate-180');
        toggle.setAttribute('aria-expanded', 'false');
    };

    const openItem = (item) => {
        const content = item.querySelector('[data-faq-content]');
        const icon = item.querySelector('[data-faq-icon]');
        const toggle = item.querySelector('[data-faq-toggle]');
        content.classList.remove('grid-rows-[0fr]', 'opacity-0');
        content.classList.add('grid-rows-[1fr]', 'opacity-100');
        icon?.classList.add('rotate-180');
        toggle.setAttribute('aria-expanded', 'true');
    };

    items.forEach((item, index) => {
      const toggle = item.querySelector('[data-faq-toggle]');
      if (!toggle) return;

      toggle.addEventListener('click', () => {
        if (openIndex === index) {
          // Klik item yang sedang terbuka, maka tutup.
          closeItem(item);
          openIndex = -1;
        } else {
          // Tutup item yang sebelumnya terbuka (jika ada).
          if (openIndex !== -1 && items[openIndex]) {
            closeItem(items[openIndex]);
          }
          // Buka item yang baru diklik.
          openItem(item);
          openIndex = index;
        }
      });
    });
  }, []);

  return (
    <div className="not-prose my-12" ref={containerRef}>
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions (FAQ)</h2>
      <div className="rounded-lg bg-white shadow-md">
        <div className="divide-y divide-gray-200 px-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default FAQ;