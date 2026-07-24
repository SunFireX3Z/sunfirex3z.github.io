/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import TowerStatTable from './TowerStatTable';

/**
 * Komponen internal untuk satu item rekomendasi tower.
 * Mengelola state untuk menampilkan/menyembunyikan statistik.
 */
function RecommendationItem({ recommendation: rec, tower, index }) {
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const hasStats = rec.showStats && tower.stats && Object.keys(tower.stats).length > 0;

  return (
    <div className="flex flex-col items-start gap-6 rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:ring-2 hover:ring-orange-300 md:flex-row">
      {/* Peringkat */}
      <div className="flex-shrink-0 text-5xl font-bold text-orange-200">
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Gambar Tower */}
      <div className="flex-shrink-0 self-center md:self-start">
        <img src={tower.image.src} alt={tower.name} className="h-24 w-24 object-contain" />
      </div>

      {/* Detail Rekomendasi */}
      <div className="w-full flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
          <h3 className="text-2xl font-bold text-gray-900">{tower.name}</h3>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">
            {rec.tier}
          </span>
        </div>
        <p className="mt-2 text-gray-600">{rec.reason}</p>

        {/* Tombol untuk toggle statistik */}
        {hasStats && (
          <button
            onClick={() => setIsStatsVisible(!isStatsVisible)}
            className="mt-4 flex items-center gap-2 text-sm font-semibold text-orange-600 transition-colors hover:text-orange-800 focus:outline-none"
          >
            <span>{isStatsVisible ? 'Sembunyikan Statistik' : 'Tampilkan Statistik'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`h-5 w-5 transform transition-transform duration-300 ${isStatsVisible ? 'rotate-180' : ''}`}>
              <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </button>
        )}

        {/* Kontainer statistik yang bisa di-toggle */}
        <div className={`grid overflow-hidden transition-all duration-500 ease-in-out ${isStatsVisible ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <div className="pt-2">
              {hasStats && <TowerStatTable stats={tower.stats} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Komponen utama untuk menampilkan daftar rekomendasi tower.
 */
function TowerRecommendation({ recommendations }) {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="not-prose my-12 space-y-8">
      {recommendations.map((item, index) => (
        <RecommendationItem key={item.tower.id} recommendation={item.recommendation} tower={item.tower} index={index} />
      ))}
    </div>
  );
}

export default TowerRecommendation;