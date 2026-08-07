/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';

const ShareButtons = () => {
    const [isCopied, setIsCopied] = useState(false);
    const [pageUrl, setPageUrl] = useState('');
    const [pageTitle, setPageTitle] = useState('');

    useEffect(() => {
        setPageUrl(window.location.href);
        setPageTitle(document.title);
    }, []);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(pageUrl);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const shareLinks = [
        {
            name: 'WhatsApp',
            url: `https://api.whatsapp.com/send?text=${encodeURIComponent(pageTitle)}%0A${encodeURIComponent(pageUrl)}`,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.357 1.849 6.081l-.119.192-.518.836.845.503.193.118z" /></svg>
            ),
            bgClass: 'bg-[#25D366] hover:bg-[#1DAA50]',
        },
        {
            name: 'Twitter',
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(pageTitle)}`,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.299 1.634 4.217 3.797 4.66-.566.155-1.166.226-1.787.167.608 1.92 2.382 3.308 4.492 3.345-1.77 1.39-3.995 2.22-6.417 2.04C.316 21.11 1.91 21.843 3.637 21.843c7.482 0 12.076-6.26 11.5-12.541 1.093-.79 1.952-1.82 2.5-2.995z" /></svg>
            ),
            bgClass: 'bg-[#1DA1F2] hover:bg-[#0c85d0]',
        },
        {
            name: 'Facebook',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
            ),
            bgClass: 'bg-[#1877F2] hover:bg-[#125db1]',
        },
    ];

    return (
        <div className="not-prose mt-10 border-t border-gray-100 pt-6">
            {/* Mengubah ukuran font judul menjadi lebih kecil & proporsional */}
            <h3 className="text-sm font-semibold tracking-wide text-gray-500 mb-3 text-center uppercase">
                Bagikan Artikel Ini
            </h3>
            
            {/* Mengurangi gap antar tombol agar tidak terlalu renggang */}
            <div className="flex items-center justify-center gap-3">
                {shareLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Bagikan ke ${link.name}`}
                        /* Perubahan dimensi: h-12 w-12 -> h-9 w-9, serta optimasi shadow */
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${link.bgClass}`}
                    >
                        {link.icon}
                    </a>
                ))}
                
                <button
                    onClick={copyToClipboard}
                    aria-label="Salin tautan"
                    /* Menyelaraskan dimensi tombol salin tautan */
                    className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gray-500 text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-600 hover:shadow-md"
                >
                    {isCopied ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 11.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5zm5.5 0c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5zm-14 3.5h24v-12h-24v12zm22-10v8h-20v-8h20zm-24 12h24v2h-24v-2z"/></svg>
                    )}
                    {isCopied && (
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-[10px] font-medium text-white shadow-sm">
                            Tautan disalin!
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ShareButtons;
