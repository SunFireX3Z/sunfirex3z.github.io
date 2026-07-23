/* eslint-disable react/prop-types */
import { useState } from 'react';
import TowerStatTable from './TowerStatTable';

/**
 * Komponen untuk menampilkan kartu informasi dasar sebuah tower.
 * @param {object} props - Properti komponen.
 * @param {object} props.tower - Objek data tower yang sudah digabungkan.
 */
function TowerCard({ tower }) {
  const [showStats, setShowStats] = useState(false);

  if (!tower) return null;

  const hasStats = tower.stats && Object.keys(tower.stats).length > 0;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300">
      <div className="relative flex-shrink-0 overflow-hidden bg-gray-100">
        <img 
          className="mx-auto h-48 w-auto object-contain p-4 transition-transform duration-300 group-hover:scale-105" 
          src={tower.image} 
          alt={`Gambar ${tower.name}`} 
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">
            {tower.name}
          </h3>
          <p className="mt-2 text-sm font-semibold text-orange-700">
            {tower.role}
          </p>

          {/* Render the stats table if showStats is true */}
          {showStats && <TowerStatTable stats={tower.stats} />}
        </div>

        {/* Button to toggle stats visibility */}
        {hasStats && (
          <button onClick={() => setShowStats(!showStats)} className="mt-4 w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300">
            {showStats ? 'Sembunyikan Statistik' : 'Tampilkan Statistik'}
          </button>
        )}
      </div>
    </div>
  );
}

export default TowerCard;