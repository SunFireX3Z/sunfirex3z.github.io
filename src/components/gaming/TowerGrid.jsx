/* eslint-disable react/prop-types */
import { mergedTowers } from '../../data/tds/mergedTowers';
import TowerCard from './TowerCard';

/**
 * Komponen untuk menampilkan grid dari TowerCard berdasarkan nama tower.
 * @param {object} props - Properti komponen.
 * @param {string[]} props.towerNames - Array berisi nama-nama tower yang akan ditampilkan.
 */
function TowerGrid({ towerNames }) {
  // Filter tower yang akan ditampilkan berdasarkan `towerNames`
  const towersToShow = mergedTowers.filter(tower => towerNames.includes(tower.id));

  if (towersToShow.length === 0) {
    return <p className="not-prose my-8 text-center text-gray-500">Tidak ada tower yang cocok untuk ditampilkan.</p>;
  }

  return (
    <div className="not-prose my-8 grid grid-cols-1 gap-8 md:grid-cols-2">
      {towersToShow.map(tower => (
        <TowerCard key={tower.id} tower={tower} />
      ))}
    </div>
  );
}

export default TowerGrid;