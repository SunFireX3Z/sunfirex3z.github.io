import { authors } from './authors';
import PlaceholderAvatar from "@/assets/images/avatar/placeholder.webp";
import { supabase } from '@/lib/db'; // Import Supabase client

// Menggunakan fitur Vite `import.meta.glob` untuk mengimpor semua file .mdx
// Opsi `{ eager: true }` memuat modul-modul ini secara langsung.
const modules = import.meta.glob('../content/**/*.mdx', { eager: true });

let allPosts = Object.entries(modules).reduce((acc, [filepath, module]) => {
        // Ekstrak metadata dan konten dari setiap modul MDX
        const { metadata, getHeadings, default: Content } = module;

        // Lewati file yang tidak memiliki metadata, tanggal publikasi, atau penulis untuk mencegah error
        if (!metadata || !metadata.publishDate || !metadata.author || metadata.status !== 'Published') {
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

// --- NEW LOGIC TO FETCH VIEWS ---
// Check if Supabase is configured before attempting to fetch views
if (import.meta.env.PUBLIC_SUPABASE_URL && import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    const slugs = allPosts.map(post => post.slug);
    const { data: postStats, error } = await supabase
        .from('post_stats')
        .select('slug, views')
        .in('slug', slugs);

    if (error) {
        console.error('Error fetching post stats from Supabase:', error.message);
        // Lanjutkan tanpa jumlah views jika ada error
    } else {
        const statsMap = new Map(postStats.map(stat => [stat.slug, stat.views]));
        allPosts = allPosts.map(post => ({
            ...post,
            metadata: {
                ...post.metadata,
                views: statsMap.get(post.slug) || 0, // Tambahkan views, default 0 jika tidak ditemukan
            },
        }));
    }
} else {
    console.warn("Supabase environment variables (PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY) are not fully configured. View counts will default to 0.");
    allPosts = allPosts.map(post => ({
        ...post,
        metadata: {
            ...post.metadata,
            views: 0, // Default 0 jika Supabase tidak terkonfigurasi
        },
    }));
}

export const posts = allPosts;
export const latestPost = posts[0];
export const featuredPosts = posts.filter(p => p.metadata.featured).slice(0, 3);
export const recentPosts = posts.filter(p => p.path !== latestPost?.path && !p.metadata.featured).slice(0, 3);