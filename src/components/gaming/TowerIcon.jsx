/* eslint-disable react/prop-types */
import { icons } from '../../data/icons';

/**
 * Komponen untuk menampilkan ikon statistik tower.
 * @param {object} props - Properti komponen.
 * @param {string} props.iconName - Nama ikon dari file `icons.js`.
 * @param {string} [props.className="h-4 w-4"] - Kelas CSS tambahan.
 */
function TowerIcon({ iconName, className = "h-4 w-4" }) {
  const iconSrc = icons[iconName];

  if (!iconSrc) {
    return null; // Atau render ikon default jika diperlukan
  }

  return (
    <img src={iconSrc} alt={`${iconName} icon`} className={`${className} object-contain`} />
  );
}

export default TowerIcon;