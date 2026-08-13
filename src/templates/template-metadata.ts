export const metadata = {
    title: "",
    description: "",
    metaDescription: "",
    publishDate: "",
    lastUpdated: "",
    updatedReason: "",
    series: "",
    status: "",
    author: "",
    category: "",
    subcategory: "",
    thumbnail: null,
    imageCaption: "",
    readingTime: 0,
    difficulty: "",
    platform: [],
    contentType: "",
    tags: [],
    featured: false,
    sources: []
};

/* --------------------------------------------------------------------------

METADATA GUIDE

title
Judul utama artikel.

description
Deskripsi singkat artikel untuk pembaca.

metaDescription
Deskripsi SEO.
Disarankan sekitar 120–160 karakter.

publishDate
Tanggal artikel dipublikasikan.
Format:
"6 August 2026"

lastUpdated
Tanggal artikel diperbarui.
Kosongkan jika belum pernah diperbarui.

updatedReason
Alasan pembaruan artikel.
Contoh:
- Menambahkan FAQ
- Memperbarui informasi
- Update versi aplikasi

series
Nama seri artikel (opsional).
Contoh:
Belajar HTML Dasar

status
Pilihan:
- Published
- Draft
- Archived

author
Nama penulis artikel.

category
Kategori utama.
Contoh:
- Teknologi
- Pemrograman
- Gaming
- Sains
- Musik
- Sejarah

subcategory
Topik yang lebih spesifik.
Contoh:
- Cloud Computing
- Astro
- Fisika
- Kemerdekaan Indonesia
- Arknights Endfield

thumbnail
Import gambar thumbnail.
Contoh:
thumbnailImage

imageCaption
Keterangan gambar thumbnail (opsional).

readingTime
Estimasi waktu membaca.
Contoh:
5
8
12

difficulty
Pilihan:
- Pemula
- Menengah
- Lanjutan

platform
Platform yang dibahas (opsional).
Contoh:
["Windows"]
["Android", "iOS"]
["PC"]

contentType
Jenis penyajian artikel.
Contoh:
- Penjelasan
- Panduan
- Tutorial
- Tips
- Review
- Perbandingan
- Daftar
- Opini
- Analisis
- Berita
- Referensi
- FAQ
- Studi Kasus
- Inspirasi

tags
Kata kunci artikel.
Contoh:
[
    "Cloud Computing",
    "Google Cloud",
    "AWS"
]

featured
true  -> tampil sebagai Featured Article
false -> artikel biasa

sources
Daftar referensi.

Contoh:
[
    {
        name: "Mozilla Developer Network",
        url: "https://developer.mozilla.org/"
    }
]

-------------------------------------------------------------------------- */