/* eslint-disable react/prop-types */
import React, { useState } from 'react';

function ShareButton() {
    const [isCopied, setIsCopied] = useState(false);

    const handleShare = async () => {
        const shareData = {
            title: document.title,
            text: `Lihat artikel menarik ini dari SunBlog: ${document.title}`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            // Fallback untuk browser desktop
            try {
                await navigator.clipboard.writeText(window.location.href);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy link:', err);
            }
        }
    };

    return (
        <button onClick={handleShare} className="flex w-full items-center justify-center gap-3 rounded-lg bg-orange-500 px-4 py-3 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-101 hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.186 2.25 2.25 0 0 0-3.933 2.186Z" /></svg>
            <span>{isCopied ? 'Tautan disalin!' : 'Bagikan Artikel'}</span>
        </button>
    );
}

export default ShareButton;