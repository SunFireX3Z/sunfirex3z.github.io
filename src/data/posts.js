import { authors } from './authors';
import PlaceholderAvatar from "@/assets/images/avatar/placeholder.webp";

// Menggunakan fitur Vite `import.meta.glob` untuk mengimpor semua file .mdx
// Opsi `{ eager: true }` memuat modul-modul ini secara langsung.
const mdxModules = import.meta.glob('../content/**/index.mdx', { eager: true });
const authorMdxModules = import.meta.glob('../content/**/index.author.mdx', { eager: true });
const metadataModules = import.meta.glob('../content/**/metadata.ts', { eager: true });

let allPosts = Object.entries(mdxModules).reduce((acc, [filepath, mdxModule]) => {
        // --- Validasi dan Pengambilan Metadata ---
        // Prioritaskan metadata dari file `metadata.ts` jika ada.
        // Jika tidak, fallback ke metadata yang diekspor dari dalam file `index.mdx`.
        const metadataPath = filepath.replace('index.mdx', 'metadata.ts');
        const metadataModule = metadataModules[metadataPath];
        
        let metadata;
        if (metadataModule && metadataModule.metadata) {
            // Skenario 1: Metadata ditemukan di `metadata.ts`
            metadata = metadataModule.metadata;
        } else if (mdxModule.metadata) {
            // Skenario 2: Fallback ke metadata di dalam `index.mdx`
            metadata = mdxModule.metadata;
        } else {
            // Jika tidak ada metadata sama sekali, lewati file ini.
            console.warn(`[Data Processing] Metadata tidak ditemukan untuk file: ${filepath}. Artikel ini akan dilewati.`);
            return acc;
        }

        // Ekstrak metadata dan konten dari setiap modul MDX
        const { getHeadings, default: Content } = mdxModule;

        // Lewati file yang tidak memiliki metadata, tanggal publikasi, atau penulis untuk mencegah error
        if (!metadata || !metadata.publishDate || !metadata.author || metadata.status !== 'Published') {
            if (metadata.status !== 'Published') {
                // Ini normal, tidak perlu warning jika statusnya bukan 'Published'
                return acc;
            }
            console.warn(`[Data Processing] Metadata tidak lengkap (kurang tanggal, penulis, atau status) untuk: ${filepath}. Artikel ini akan dilewati.`);
            return acc;
        }

        // Cari penulis berdasarkan nama pendek (key) atau nama lengkap
        const authorIdentifier = metadata.author;
        const foundAuthorEntry = Object.entries(authors).find(
            ([key, authorData]) => key === authorIdentifier || (authorData.fullName && authorData.fullName === authorIdentifier)
        );

        // Jika penulis tidak ditemukan, tampilkan peringatan dan jangan tambahkan post
        if (!foundAuthorEntry) {
            console.warn(`[Data Processing] Penulis "${authorIdentifier}" tidak ditemukan di authors.js untuk artikel: ${filepath}`);
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

            // Cari modul gaya penulis yang sesuai (`index.author.mdx`)
            const authorMdxPath = filepath.replace('index.mdx', 'index.author.mdx');
            const authorModule = authorMdxModules[authorMdxPath];

            acc.push({
                slug,
                lang,
                category: metadata.category || folderCategory,
                path: finalPath,
                metadata: processedMetadata,
                Content,
                AuthorContent: authorModule ? authorModule.default : null, // Tambahkan AuthorContent
                getHeadings,
                getAuthorHeadings: authorModule ? authorModule.getHeadings : null,
            });
        }
        return acc;
    }, [])
    .sort((a, b) => new Date(b.metadata.publishDate) - new Date(a.metadata.publishDate)); // Urutkan dari yang terbaru

export const posts = allPosts;
export const latestPost = posts[0];
export const featuredPosts = posts.filter(p => p.metadata.featured).slice(0, 3);
export const recentPosts = posts.filter(p => p.path !== latestPost?.path && !p.metadata.featured).slice(0, 3);