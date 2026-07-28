/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

// Helper untuk format angka (misal: 1200 -> 1.2K)
const formatViews = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
};

function ViewCounter({ slug }) {
    const [views, setViews] = useState(null);

    useEffect(() => {
        const articleSessionKey = `viewed-${slug}`;

        const incrementView = async () => {
            try {
                const response = await fetch(`/api/views/${slug}`, { method: 'POST' });
                if (response.ok) {
                    const data = await response.json();
                    setViews(data.views);
                    sessionStorage.setItem(articleSessionKey, 'true');
                } else if (response.status === 503) {
                    setViews(0); // Fallback jika DB tidak terkonfigurasi
                }
            } catch (error) {
                console.error('Failed to increment view count:', error);
            }
        };

        const getViews = async () => {
            try {
                const response = await fetch(`/api/views/${slug}`);
                if (response.ok) {
                    const data = await response.json();
                    setViews(data.views);
                } else if (response.status === 503) {
                    setViews(0);
                }
            } catch (error) {
                console.error('Failed to fetch view count:', error);
            }
        };

        const hasViewed = sessionStorage.getItem(articleSessionKey);
        if (!hasViewed) {
            incrementView();
        } else {
            getViews();
        }
    }, [slug]);

    if (views === null) {
        return null; // Tidak menampilkan apa-apa saat loading
    }

    return (
        <>
            <div className="flex items-center text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2 text-gray-400"><path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" /><path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.18l.88-1.467a1.65 1.65 0 0 1 1.515-.882H4.84a1.65 1.65 0 0 1 1.515.882l.88 1.467a1.651 1.651 0 0 1 0 1.18l-.88 1.467a1.65 1.65 0 0 1-1.515.882H3.059a1.65 1.65 0 0 1-1.515-.882l-.88-1.467Z" clipRule="evenodd" /></svg>
                <span className="font-semibold">Dilihat</span>
            </div>
            <span className="font-semibold text-gray-800">{formatViews(views)} kali</span>
        </>
    );
}

export default ViewCounter;