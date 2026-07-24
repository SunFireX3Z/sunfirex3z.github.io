import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Komponen ini akan secara otomatis menggulir halaman ke atas
 * setiap kali terjadi perubahan rute (navigasi halaman).
 *
 * [CATATAN PENTING] Komponen ini menggunakan `useLocation` dari `react-router-dom`,
 * yang tidak kompatibel dengan sistem routing berbasis file (MPA) milik Astro.
 * Navigasi di Astro adalah muat ulang halaman penuh, bukan transisi di sisi klien.
 * Sebaiknya hapus komponen ini dan dependensi `react-router-dom`.
 * Astro secara default sudah melakukan scroll ke atas pada navigasi halaman.
 */
function ScrollToTop() {
  useEffect(() => {
    // Logika ini tidak akan berjalan seperti yang diharapkan di Astro.
  }, []);

  return null; // Komponen ini tidak merender apa pun
}

export default ScrollToTop;