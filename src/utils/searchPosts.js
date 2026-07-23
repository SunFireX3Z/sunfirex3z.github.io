/**
 * Fungsi untuk mencari postingan berdasarkan query.
 * Pencarian dilakukan pada judul, deskripsi, dan tag untuk artikel berbahasa Indonesia.
 * @param {string} query - Kata kunci pencarian.
 * @param {Array} allPosts - Array dari SEMUA objek postingan (termasuk semua bahasa).
 * @returns {Array} - Array dari postingan yang cocok dengan query dan sudah difilter bahasanya.
 */
export function searchPosts(query, allPosts) {
  // Jika query kosong, kembalikan array kosong
  if (!query || query.trim() === '') {
    return [];
  }

  // Lakukan pencarian hanya pada artikel berbahasa Indonesia
  const postsInIndonesian = allPosts.filter(p => p.lang === 'id');
  const lowercasedQuery = query.toLowerCase();

  return postsInIndonesian.filter(post => {
    // Pastikan post tidak null/undefined setelah proses filter bahasa
    if (!post) return false;

    const { title, description, tags } = post.metadata;

    // Cek judul
    if (title && title.toLowerCase().includes(lowercasedQuery)) {
      return true;
    }
    // Cek deskripsi
    if (description && description.toLowerCase().includes(lowercasedQuery)) {
      return true;
    }
    // Cek tag
    return tags && tags.some(tag => tag.toLowerCase().includes(lowercasedQuery));
  });
}