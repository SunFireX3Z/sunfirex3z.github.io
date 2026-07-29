/**
 * Menghasilkan skema JSON-LD untuk WebPage.
 * Skema ini membantu mesin pencari memahami struktur dasar halaman
 * dan secara eksplisit mendefinisikan gambar utama halaman.
 * @param {object} data - Data untuk skema.
 * @param {string} data.title - Judul halaman.
 * @param {string} data.description - Deskripsi halaman.
 * @param {string} data.imageUrl - URL gambar utama.
 * @param {string} data.canonicalUrl - URL kanonis halaman.
 * @param {string} data.siteUrl - URL dasar situs.
 * @param {string} data.siteName - Nama situs.
 * @returns {object} Objek skema WebPage.
 */
export function generateWebPageSchema({ title, description, imageUrl, canonicalUrl, siteUrl, siteName }) {
    return {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "url": canonicalUrl,
        "name": title,
        "description": description,
        "primaryImageOfPage": {
            "@type": "ImageObject",
            "url": imageUrl,
            "width": 1200,
            "height": 630,
        },
        "isPartOf": {
            "@type": "WebSite",
            "url": siteUrl,
            "name": siteName,
        },
    };
}