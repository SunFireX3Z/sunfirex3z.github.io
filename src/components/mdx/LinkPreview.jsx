/* eslint-disable react/prop-types */
import React, { useState, useRef } from 'react';

function LinkPreview({ children, className, title, description, image }) {
    const [isVisible, setIsVisible] = useState(false);
    const hoverTimeoutRef = useRef(null);

    // Jika tidak ada deskripsi, tampilkan sebagai teks biasa tanpa tooltip.
    if (!description) {
        return (
            <span className={className}>
                {children}
            </span>
        );
    }

    const handleMouseEnter = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setIsVisible(true);
        }, 300);
    };

    const handleMouseLeave = () => {
        clearTimeout(hoverTimeoutRef.current);
        setIsVisible(false);
    };

    // Dapatkan src dari objek gambar Astro
    const imageSrc = typeof image === 'object' && image !== null ? image.src : image;

    return (
        <span
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <span
                className={`cursor-help font-semibold text-orange-600 transition-colors hover:text-orange-700 ${className || ''}`}
            >
                {children}
            </span>

            <div
                className={`not-prose absolute bottom-full left-1/2 z-20 mb-2 w-80 -translate-x-1/2 transform overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl transition-all duration-300 ease-in-out ${isVisible ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible'}`}
                style={{ pointerEvents: 'none' }} // Mencegah tooltip menangkap event mouse
            >
                <div>
                    {imageSrc && (
                        <img
                            src={imageSrc}
                            alt={`Ilustrasi untuk ${title || children}`}
                            className="h-36 w-full object-cover bg-gray-100"
                        />
                    )}
                    <div className="p-3 text-left">
                        <h4 className="line-clamp-2 text-base font-semibold text-gray-800">{title || children}</h4>
                        <p className="mt-1 line-clamp-3 text-sm text-gray-600">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </span>
    );
}

export default LinkPreview;