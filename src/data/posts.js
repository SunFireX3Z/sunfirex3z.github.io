import { authors } from './authors';
import PlaceholderAvatar from "@/assets/images/avatar/placeholder.webp";

// Menggunakan fitur Vite `import.meta.glob` untuk mengimpor semua file .mdx
// Opsi `{ eager: true }` memuat modul-modul ini secara langsung.
const modules = import.meta.glob('../content/**/*.mdx', { eager: true });

export const posts = Object.entries(modules).reduce((acc, [filepath, module]) => {
        // Ekstrak metadata dan konten dari setiap modul MDX
        const { metadata, getHeadings, default: Content } = module;

        // Lewati file yang tidak memiliki metadata, tanggal publikasi, atau penulis untuk mencegah error
        if (!metadata || !metadata.publishDate || !metadata.author) {
            return acc;
        }

        // Cari penulis berdasarkan nama pendek (key) atau nama lengkap
        const authorIdentifier = metadata.author;
        const foundAuthorEntry = Object.entries(authors).find(
            ([key, authorData]) => key === authorIdentifier || (authorData.fullName && authorData.fullName === authorIdentifier)
        );

        // Jika penulis tidak ditemukan, tampilkan peringatan dan jangan tambahkan post
        if (!foundAuthorEntry) {
            console.warn(`Author "${authorIdentifier}" not found in authors.js for post: ${filepath}`);
            return acc;
        }

        const pathParts = filepath.split('/');
        const lang = pathParts[2]; // 'id' atau 'en'

        // Proses hanya post berbahasa Indonesia
        if (lang === 'id') {
            const authorDetails = foundAuthorEntry[1];
            const processedMetadata = {
                ...metadata,
                author: authorDetails.fullName,
                authorAvatar: authorDetails.avatar ?? PlaceholderAvatar,
            };

            const folderCategory = pathParts[3];
            const slug = pathParts[4];

            const categoryForPath = (metadata.category || folderCategory).toLowerCase().replace(/\s+/g, '-');
            const subcategoryForPath = metadata.subcategory ? `/${metadata.subcategory.toLowerCase().replace(/\s+/g, '-')}` : '';
            const finalPath = `/blog/${categoryForPath}${subcategoryForPath}/${slug}`;

            acc.push({
                slug,
                lang,
                category: metadata.category || folderCategory,
                path: finalPath,
                metadata: processedMetadata,
                Content,
                getHeadings, // Tambahkan fungsi getHeadings ke objek post
            });
        }
        return acc;
    }, [])
    .sort((a, b) => new Date(b.metadata.publishDate) - new Date(a.metadata.publishDate)); // Urutkan dari yang terbaru

// Anda bisa mengekspor data lain yang sudah diproses di sini jika perlu
export const latestPost = posts[0];

// Ambil hingga 3 postingan yang ditandai sebagai 'featured'
export const featuredPosts = posts.filter(p => p.metadata.featured).slice(0, 3);

// Ambil postingan lain yang bukan 'latest' dan bukan 'featured'
export const recentPosts = posts.filter(p => p.path !== latestPost?.path && !p.metadata.featured).slice(0, 3);