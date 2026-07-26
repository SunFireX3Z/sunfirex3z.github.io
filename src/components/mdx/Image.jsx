/* eslint-disable react/prop-types */

/**
 * Komponen untuk menampilkan gambar dengan caption opsional di dalam artikel MDX.
 *
 * @param {object} props
 * @param {string|object} props.src - Sumber gambar (hasil import Astro atau URL).
 * @param {string} props.alt - Teks alternatif gambar.
 * @param {string} [props.caption] - Caption gambar.
 * @param {string} [props.className] - Class Tailwind tambahan untuk mengatur ukuran/tampilan gambar.
 */
function Image({
  src,
  alt,
  caption,
  className = "",
}) {
  // Jika hasil import Astro, gunakan .src
  const imagePath = typeof src === "string" ? src : src.src;

  return (
    <figure className="not-prose my-8 flex flex-col items-center">
      <img
        src={imagePath}
        alt={alt}
        className={`w-full rounded-lg object-cover shadow-md ${className}`}
      />

      {caption && (
        <figcaption className="mt-3 text-center text-sm italic text-gray-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export default Image;