import { supabase } from '@/lib/db';

export const prerender = false;

// Handler untuk permintaan POST (menambah jumlah view)
export async function POST({ params }) {
    const { slug } = params;

    if (!slug) {
        return new Response(JSON.stringify({ message: 'Slug is required' }), { status: 400 });
    }

    try {
        // CATATAN: Pendekatan ini (baca lalu tulis) tidak sepenuhnya aman dari race condition
        // pada traffic yang sangat tinggi. Metode yang lebih aman adalah menggunakan fungsi RPC
        // di database untuk melakukan penambahan nilai secara atomik.

        // 1. Ambil data view saat ini
        const { data: existingData, error: selectError } = await supabase
            .from('post_stats')
            .select('views')
            .eq('slug', slug)
            .single();

        // Abaikan error jika baris tidak ditemukan (kode 'PGRST116'), itu berarti view-nya 0
        if (selectError && selectError.code !== 'PGRST116') {
            throw selectError;
        }

        const currentViews = existingData?.views ?? 0;
        const newViews = currentViews + 1;

        // 2. Lakukan UPSERT (update atau insert) dengan nilai baru
        const { data, error: upsertError } = await supabase
            .from('post_stats')
            .upsert({ slug: slug, views: newViews, updated_at: new Date().toISOString() }, { onConflict: 'slug' })
            .select('views')
            .single();

        if (upsertError) {
            console.error('Supabase upsert error:', upsertError.message);
            return new Response(JSON.stringify({ message: 'Could not update views' }), { status: 500 });
        }

        return new Response(JSON.stringify({ views: data.views }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        // Menangani kasus di mana variabel env Supabase tidak diatur
        if (error.message.includes("options.auth.jwt")) {
            return new Response(JSON.stringify({ message: 'Database not configured' }), { status: 503 });
        }
        console.error('Unexpected error updating view count:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}

// Handler untuk permintaan GET (mengambil jumlah view)
export async function GET({ params }) {
    const { slug } = params;

    if (!slug) {
        return new Response(JSON.stringify({ message: 'Slug is required' }), { status: 400 });
    }

    try {
        const { data, error } = await supabase
            .from('post_stats')
            .select('views')
            .eq('slug', slug)
            .single(); // .single() untuk mendapatkan satu objek, bukan array

        // Abaikan error jika tidak ada baris yang ditemukan (PGRST116), itu berarti view-nya 0
        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        const views = data?.views ?? 0;

        return new Response(JSON.stringify({ views }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        if (error.message.includes("options.auth.jwt")) {
            return new Response(JSON.stringify({ message: 'Database not configured' }), { status: 503 });
        }
        console.error('Error fetching view count:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}
