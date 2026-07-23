import { towers } from './towers';
import { towerStats } from './towerStats';

// Gabungkan data tampilan dan data statistik menjadi satu struktur data yang mudah digunakan.
export const mergedTowers = Object.keys(towers).map(towerName => {
    const viewData = towers[towerName];
    const statsData = towerStats[towerName] || {}; // Fallback ke objek kosong jika stats tidak ada

    return {
        id: towerName, // Gunakan nama sebagai ID unik
        ...viewData,
        stats: statsData,
    };
});