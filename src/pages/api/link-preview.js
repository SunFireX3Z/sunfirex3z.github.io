// Beritahu Astro untuk tidak pre-render endpoint ini. Ini diperlukan agar request POST berfungsi.
export const prerender = false;

// Fungsi helper untuk mengekstrak konten dari meta tag menggunakan regex.
const getMetaTag = (html, property) => {
  const regex = new RegExp(`<meta[^>]*?(?:name|property)=["']${property}["'][^>]*?content=["']([^"']*)["']`, 'i');
  const match = html.match(regex);
  return match ? match[1] : null;
};

// Fungsi helper untuk mengekstrak konten dari tag <title>.
const getTitleTag = (html) => {
    const regex = /<title>([^<]*)<\/title>/i;
    const match = html.match(regex);
    return match ? match[1] : null;
}

/**
 * API endpoint untuk mengambil metadata Open Graph (OG) dari sebuah URL.
 * @param {object} context - Konteks request Astro.
 * @param {Request} context.request - Objek request.
 */
export async function POST({ request }) { // Mengubah dari GET ke POST
  let body;
  try {
    body = await request.json();
  } catch (e) {
    // Tangani kasus di mana body request bukan JSON yang valid atau kosong.
    // console.error('[API /api/link-preview] Error: Gagal mem-parsing JSON body dari request.', e.message);
    return new Response(JSON.stringify({ error: 'Request body tidak valid atau kosong.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  const targetUrl = body.url;

  if (!targetUrl) {
    return new Response(JSON.stringify({ error: 'Properti `url` tidak ditemukan di dalam body request.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Lakukan fetch di sisi server untuk menghindari CORS
    const response = await fetch(targetUrl, {
        headers: {
            // Menyamar sebagai browser untuk menghindari beberapa blokade bot sederhana
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    });

    if (!response.ok) {
      throw new Error(`Gagal mengambil data: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();

    // Ekstrak data Open Graph, dengan fallback ke tag standar
    const title = getMetaTag(html, 'og:title') || getTitleTag(html);
    const description = getMetaTag(html, 'og:description') || getMetaTag(html, 'description');
    let image = getMetaTag(html, 'og:image');

    // Pastikan URL gambar adalah absolut
    if (image && !image.startsWith('http')) {
        const urlObject = new URL(targetUrl);
        image = new URL(image, urlObject.origin).href;
    }

    if (!title) {
        return new Response(JSON.stringify({ error: 'Tidak dapat menemukan data pratinjau untuk tautan ini.' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify({ title, description, image }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: `Gagal mengambil atau mem-parsing URL: ${error.message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}