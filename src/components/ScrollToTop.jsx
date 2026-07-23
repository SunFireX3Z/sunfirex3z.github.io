import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Komponen ini akan secara otomatis menggulir halaman ke atas
 * setiap kali terjadi perubahan rute (navigasi halaman).
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Komponen ini tidak merender apa pun
}

export default ScrollToTop;