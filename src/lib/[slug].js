import { db } from '@/lib/db';

// Handler untuk permintaan POST (menambah jumlah view)
export async function POST({ params }) {
    const { slug } = params;

    if (!slug) {
        return new Response(JSON.stringify({ message: 'Slug is required' }), { status: 400 });
    }

    try {
        // Operasi UPSERT:
        // Jika slug belum ada, buat baris baru dengan views = 1.
        // Jika sudah ada, tambahkan nilai views dengan 1.
        const result = await db`
            INSERT INTO post_stats (slug, views)
            VALUES (${slug}, 1)
            ON CONFLICT (slug)
            DO UPDATE SET
                views = post_stats.views + 1,
                updated_at = NOW()
            RETURNING views;
        `;

        const views = result[0]?.views;

        if (views === undefined) {
             return new Response(JSON.stringify({ message: 'Could not update views' }), { status: 500 });
        }

        return new Response(JSON.stringify({ views }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        if (error.message.includes("DATABASE_URL")) {
            return new Response(JSON.stringify({ message: 'Database not configured' }), { status: 503 });
        }
        console.error('Error updating view count:', error);
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
        const result = await db`SELECT views FROM post_stats WHERE slug = ${slug};`;
        const views = result[0]?.views ?? 0;

        return new Response(JSON.stringify({ views }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        if (error.message.includes("DATABASE_URL")) {
            return new Response(JSON.stringify({ message: 'Database not configured' }), { status: 503 });
        }
        console.error('Error fetching view count:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}