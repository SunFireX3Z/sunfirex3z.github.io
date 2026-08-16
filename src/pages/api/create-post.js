import { promises as fs } from 'node:fs';
import path from 'node:path';

// Menonaktifkan pre-rendering agar endpoint ini berjalan di server saat di-request.
export const prerender = false;

// Fungsi helper untuk mengubah judul menjadi slug yang ramah URL.
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')           // Ganti spasi dengan -
        .replace(/[^\w\-]+/g, '')       // Hapus karakter non-kata
        .replace(/\-\-+/g, '-')         // Ganti -- dengan -
        .replace(/^-+/, '')             // Hapus - di awal
        .replace(/-+$/, '');            // Hapus - di akhir
}

// Template untuk file metadata.ts
const createMetadataTemplate = (data) => `import thumbnailImage from "./thumbnail.webp";

export const metadata = {
    title: "${data.title}",
    description: "${data.description}",
    metaDescription: "${data.metaDescription}",
    publishDate: "${data.publishDate}",
    lastUpdated: "",
    updatedReason: "",
    series: "${data.series}",
    status: "Published",
    author: "${data.author}",
    category: "${data.category}",
    subcategory: "${data.subcategory}",
    thumbnail: thumbnailImage,
    imageCaption: "${data.imageCaption}",
    readingTime: ${data.readingTime},
    difficulty: "${data.difficulty}",
    platform: ${data.platform},
    contentType: "${data.contentType}",
    tags: ${data.tags},
    featured: ${data.featured},
    sources: ${data.sources}
};`;

// Template untuk file index.mdx
const createMdxTemplate = () => `import CallToAction from '@/components/mdx/CallToAction.astro';
import Youtube from '@/components/mdx/Youtube.jsx';
import InfoTable from '@/components/mdx/InfoTable.jsx';
import Tip from '@/components/mdx/Tip.jsx';
import Warning from '@/components/mdx/Warning.jsx';
import FAQ, { FAQItem } from '@/components/mdx/FAQ.jsx';
import Note from '@/components/mdx/Note.jsx';
import Image from '@/components/mdx/Image.astro';
import Blockquote from '@/components/mdx/Blockquote.jsx';
import RelatedArticle from '@/components/mdx/RelatedArticle.astro';
import LinkPreview from '@/components/mdx/LinkPreview.astro';
import Shopeeproduct from '@/components/mdx/ShopeeProduct.astro';

## Judul Materi

Tulis konten artikel Anda di sini...`;

export async function POST({ request }) {
    // Tolak akses jika berada di lingkungan produksi
    if (import.meta.env.PROD) {
        return new Response(JSON.stringify({ error: 'Akses ditolak' }), { status: 403 });
    }

    try {
        const formData = await request.formData();
        const data = Object.fromEntries(formData);
        const thumbnailFile = data.thumbnail;

        if (!data.title || !data.category || !thumbnailFile?.size) {
            return new Response(JSON.stringify({ error: 'Judul, Kategori, dan Thumbnail wajib diisi.' }), { status: 400 });
        }

        // Sanitasi dan persiapkan data untuk template
        const templateData = {
            ...data,
            title: data.title.replace(/"/g, '\\"'),
            description: data.description.replace(/"/g, '\\"'),
            metaDescription: data.metaDescription.replace(/"/g, '\\"'),
            series: data.series.replace(/"/g, '\\"'),
            imageCaption: data.imageCaption.replace(/"/g, '\\"'),
            publishDate: new Date(data.publishDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
            readingTime: Number(data.readingTime) || 0,
            platform: JSON.stringify(data.platform.split(',').map(p => p.trim()).filter(Boolean)),
            tags: JSON.stringify(data.tags.split(',').map(tag => tag.trim()).filter(Boolean)),
            featured: data.featured === 'true', // FormData mengubah boolean menjadi string
            sources: data.sources.trim() || '[]'
        };

        // Validasi format JSON pada field 'sources'
        try {
            JSON.parse(templateData.sources);
        } catch (e) {
            return new Response(JSON.stringify({ error: 'Format JSON pada field "Sumber Referensi" tidak valid.' }), { status: 400 });
        }

        const slug = slugify(data.title);
        const categorySlug = slugify(data.category);
        const postDir = path.join(process.cwd(), 'src', 'content', 'id', categorySlug, slug);

        await fs.mkdir(postDir, { recursive: true });

        // Buat folder 'image' di dalam direktori artikel
        await fs.mkdir(path.join(postDir, 'image'));

        const thumbnailBuffer = await thumbnailFile.arrayBuffer();
        await fs.writeFile(path.join(postDir, 'thumbnail.webp'), Buffer.from(thumbnailBuffer));
        await fs.writeFile(path.join(postDir, 'metadata.ts'), createMetadataTemplate(templateData).trim());
        await fs.writeFile(path.join(postDir, 'index.mdx'), createMdxTemplate().trim());
        await fs.writeFile(path.join(postDir, 'index.author.mdx'), createMdxTemplate().trim());

        const newPostUrl = `/blog/${categorySlug}/${data.subcategory ? slugify(data.subcategory) + '/' : ''}${slug}`;
        return new Response(JSON.stringify({ message: 'Artikel berhasil dibuat!', url: newPostUrl }), { status: 201 });
    } catch (error) {
        console.error('Error creating post:', error);
        return new Response(JSON.stringify({ error: 'Terjadi kesalahan di server: ' + error.message }), { status: 500 });
    }
}