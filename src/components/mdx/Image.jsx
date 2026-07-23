/* eslint-disable react/prop-types */

/**
 * Komponen untuk menampilkan gambar dengan caption opsional di dalam artikel MDX.
 * @param {object} props - Properti komponen.
 * @param {string} props.src - Sumber gambar.
 * @param {string} props.alt - Teks alternatif untuk gambar.
 * @param {string} [props.caption] - Caption opsional untuk gambar.
 */
function Image({ src, alt, caption }) {
  // Astro memproses gambar yang diimpor sebagai objek. Kita perlu mengambil path `.src` dari objek tersebut.
  // Jika `src` sudah berupa string (misalnya dari URL eksternal), gunakan apa adanya.
  const imagePath = typeof src === 'string' ? src : src.src;

  return (
    <figure className="not-prose my-8 flex flex-col items-center">
      <img 
        src={imagePath} 
        alt={alt} 
        className="w-full max-w-3xl rounded-lg object-cover shadow-md" 
      />
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-gray-500 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export default Image;