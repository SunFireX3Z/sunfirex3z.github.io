/* eslint-disable react/prop-types */

/**
 * Komponen untuk menampilkan disclaimer singkat mengenai akurasi konten.
 * @param {object} props - Properti komponen.
 * @param {React.ReactNode} props.children - Konten kustom yang akan ditampilkan di dalam kotak. Jika kosong, akan menampilkan pesan default.
 */
function Disclaimer({ children }) {
  const defaultContent = (
    <>
      Informasi di SunBlog dapat mengandung kekeliruan. Periksa kembali informasi penting melalui sumber resmi dan terpercaya.
    </>
  );

  return (
    <div className="not-prose my-8 text-center text-xs text-gray-500 italic">
      {children || defaultContent}
    </div>
  );
}

export default Disclaimer;