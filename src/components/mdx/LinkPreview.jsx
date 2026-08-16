/* eslint-disable react/prop-types */
import React, { useState, useRef, useCallback } from 'react';

// Impor semua gambar placeholder secara dinamis untuk digunakan sebagai fallback acak.
const placeholderImageModules = import.meta.glob('/src/assets/images/placeholder/*.{jpeg,jpg,png,webp}', { eager: true });
const placeholderPool = Object.values(placeholderImageModules).map(module => module.default);

// Fungsi untuk mendapatkan satu placeholder acak dari pool.
const getRandomPlaceholder = () => {
    if (placeholderPool.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * placeholderPool.length);
    return placeholderPool[randomIndex];
};

// Cache sederhana di memori untuk menghindari fetch berulang untuk URL yang sama
const previewCache = new Map();

function LinkPreview({ href, children, className }) {
    const [previewData, setPreviewData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const hoverTimeoutRef = useRef(null);

    // Pilih satu placeholder acak saat komponen pertama kali dirender dan simpan di state.
    const [randomPlaceholder] = useState(getRandomPlaceholder);

    const fetchPreview = useCallback(async () => {
        // Cek cache terlebih dahulu
        if (previewCache.has(href)) {
            const cachedData = previewCache.get(href);
            if (cachedData.error) {
                setError(cachedData.error);
            } else {
                setPreviewData(cachedData);
            }
            setIsLoading(false);
            return;
        }

        // Tambahkan validasi di sisi klien untuk memberikan pesan error yang lebih jelas
        if (!href) {
            setError('Tautan (href) tidak valid atau kosong.');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Menggunakan metode POST untuk mengirim URL di body, lebih andal daripada query param
            const response = await fetch(`/api/link-preview`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: href }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Gagal mengambil pratinjau');
            }
            const data = await response.json();
            setPreviewData(data);
            previewCache.set(href, data); // Simpan hasil ke cache
        } catch (err) {
            const errorMessage = err.message || 'Tidak dapat memuat pratinjau.';
            setError(errorMessage);
            previewCache.set(href, { error: errorMessage }); // Simpan error ke cache
        } finally {
            setIsLoading(false);
        }
    }, [href]);

    const handleMouseEnter = () => {
        // Beri jeda sebelum menampilkan pratinjau untuk UX yang lebih baik
        hoverTimeoutRef.current = setTimeout(() => {
            setIsVisible(true);
            // Hanya fetch jika data belum ada
            if (!previewData && !isLoading && !error) {
                fetchPreview();
            }
        }, 300); // Jeda 300ms
    };

    const handleMouseLeave = () => {
        clearTimeout(hoverTimeoutRef.current);
        setIsVisible(false);
    };

    return (
        <span
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <a
                href={href}
                className={`cursor-help border-b border-dashed border-orange-500/70 transition-colors hover:border-solid hover:border-orange-500 hover:text-orange-600 ${className || ''}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                {children}
            </a>

            <div
                className={`not-prose absolute bottom-full left-1/2 z-20 mb-2 w-80 -translate-x-1/2 transform overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl transition-all duration-300 ease-in-out ${isVisible ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible'}`}
                style={{ pointerEvents: 'none' }} // Mencegah tooltip menangkap event mouse
            >
                {isLoading && (
                    <div className="animate-pulse">
                        <div className="h-36 w-full bg-gray-200"></div>
                        <div className="p-3">
                            <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                            <div className="mt-2 h-3 w-full rounded bg-gray-200"></div>
                            <div className="mt-1 h-3 w-5/6 rounded bg-gray-200"></div>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="p-3 text-center text-sm text-gray-500">
                        <p className="font-semibold">Tidak dapat memuat pratinjau</p>
                        <p className="mt-1 text-xs">{error}</p>
                    </div>
                )}
                {previewData && (
                    <div>
                        <img
                            src={previewData.image || randomPlaceholder?.src}
                            alt={`Preview for ${previewData.title}`}
                            className="h-36 w-full object-cover bg-gray-100"
                            onError={(e) => {
                                // Mencegah loop tak terbatas jika placeholder juga gagal dimuat
                                if (e.target.src !== randomPlaceholder?.src) {
                                    e.target.onerror = null;
                                    e.target.src = randomPlaceholder?.src;
                                }
                            }}
                        />
                        <div className="p-3 text-left">
                            <h4 className="line-clamp-2 text-base font-semibold text-gray-800">{previewData.title}</h4>
                            {previewData.description && (
                                <p className="mt-1 line-clamp-3 text-sm text-gray-600">
                                    {previewData.description}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </span>
    );
}

export default LinkPreview;