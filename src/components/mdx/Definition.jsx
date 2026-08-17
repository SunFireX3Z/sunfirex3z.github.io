/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

function Definition({ children, className, title, description, image }) {
    // State untuk mengontrol intent (keinginan) untuk menampilkan/menyembunyikan
    const [isVisible, setIsVisible] = useState(false);
    // State untuk mengontrol kelas animasi (fade in/out)
    const [isAnimating, setIsAnimating] = useState(false);
    // State untuk mengontrol mounting komponen di DOM
    const [isMounted, setIsMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const hoverTimeoutRef = useRef(null);

    const portalContainerRef = useRef(null);
    const triggerRef = useRef(null); // Ref untuk elemen <span> pemicu

    // Mengelola mounting dan animasi
    useEffect(() => {
        let timeoutId;
        if (isVisible) {
            // 1. Mount komponen
            setIsMounted(true);
            // 2. Setelah sedikit delay untuk mounting, picu animasi masuk
            timeoutId = setTimeout(() => {
                setIsAnimating(true);
            }, 20); // Delay kecil untuk memastikan transisi CSS berjalan
        } else {
            // 1. Pemicu animasi keluar
            setIsAnimating(false);
            // 2. Setelah animasi keluar selesai, unmount komponen
            timeoutId = setTimeout(() => {
                setIsMounted(false);
            }, 300); // Harus cocok dengan durasi transisi
        }
        return () => clearTimeout(timeoutId);
    }, [isVisible]);

    // Efek untuk mendeteksi perangkat mobile dan menyiapkan portal root (hanya sekali)
    useEffect(() => {
        // Buat container untuk portal modal jika belum ada
        let portalRoot = document.getElementById('definition-portal-root');
        if (!portalRoot) {
            portalRoot = document.createElement('div');
            portalRoot.id = 'definition-portal-root';
            document.body.appendChild(portalRoot);
        }
        portalContainerRef.current = portalRoot;

        const checkIsMobile = () => {
            // Menggunakan 768px sebagai batas untuk perangkat mobile/tablet
            setIsMobile(window.innerWidth < 768);
        };
        checkIsMobile(); // Cek saat pertama kali render
        window.addEventListener('resize', checkIsMobile);
        return () => { window.removeEventListener('resize', checkIsMobile); };
    }, []);

    // Fungsi untuk menghitung dan memperbarui posisi tooltip desktop
    const updatePosition = useCallback(() => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setPosition({
                // Posisikan di atas elemen pemicu, dengan sedikit margin
                top: rect.top + window.scrollY - 10,
                // Pusatkan secara horizontal
                left: rect.left + window.scrollX + rect.width / 2,
            });
        }
    }, []);


    // Jika tidak ada deskripsi, tampilkan sebagai teks biasa tanpa tooltip.
    if (!description) {
        return (
            <span className={className}>
                {children}
            </span>
        );
    }

    // --- Event Handlers untuk Desktop (Hover) ---
    const handleMouseEnter = () => {
        if (!isMobile) {
            updatePosition(); // Hitung posisi saat hover dimulai
            hoverTimeoutRef.current = setTimeout(() => {
                setIsVisible(true);
            }, 300);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            clearTimeout(hoverTimeoutRef.current);
            setIsVisible(false);
        }
    };

    // --- Event Handler untuk Mobile (Klik) ---
    const handleClick = (e) => {
        if (isMobile) {
            e.preventDefault();
            setIsVisible(true); // Gunakan state yang sama untuk membuka modal
        }
    };

    const closeModal = () => {
        setIsVisible(false);
    };

    // Dapatkan src dari objek gambar Astro
    const imageSrc = typeof image === 'object' && image !== null ? image.src : image;

    // Konten kartu yang akan digunakan kembali di tooltip dan modal
    const CardContent = () => (
        <>
            {imageSrc && (
                <img
                    src={imageSrc}
                    alt={`Ilustrasi untuk ${title || children}`}
                    className="h-36 w-full object-cover bg-gray-100"
                />
            )}
            <div className="p-4 text-left">
                <h4 className="relative line-clamp-2 text-base font-semibold text-gray-800 pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-orange-500">{title || children}</h4>
                <p className="mt-1 text-sm text-gray-600">
                    {description}
                </p>
            </div>
        </>
    );

    return (
        <>
            <span
                ref={triggerRef}
                className={`cursor-help font-semibold text-orange-600 transition-colors hover:text-orange-700 ${className || ''}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
            >
                {children}
            </span>

            {/* Portal untuk Tooltip dan Modal */}
            {isMounted && portalContainerRef.current && createPortal(
                isMobile ? (
                    // Tampilan Modal di Mobile (Backdrop)
                    <div
                        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
                        onClick={closeModal}
                        role="dialog"
                        aria-modal="true"
                    >
                        {/* Modal Content */}
                        <div
                            className={`relative m-4 w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-300 ease-out ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button onClick={closeModal} className="absolute top-2 right-2 z-10 rounded-full bg-gray-500/30 p-1 text-white hover:bg-gray-500/50" aria-label="Tutup">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                            <CardContent />
                        </div>
                    </div>
                ) : (
                    // Tampilan Tooltip di Desktop
                    <div
                        className={`not-prose absolute z-20 w-80 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl transition-all duration-300 ease-in-out ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                        style={{
                            top: `${position.top}px`,
                            left: `${position.left}px`,
                            transform: 'translateX(-50%) translateY(-100%)',
                            pointerEvents: 'none',
                        }}
                    >
                        <CardContent />
                    </div>
                ),
                portalContainerRef.current
            )}
        </>
    );
}

export default Definition;