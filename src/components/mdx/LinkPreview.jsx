/* eslint-disable react/prop-types */
import React, { useState, useRef } from 'react';

function LinkPreview({ href, children, className, title, description, image }) {
    const [isVisible, setIsVisible] = useState(false);
    const hoverTimeoutRef = useRef(null);

    // Jika tidak ada judul yang diberikan, tampilkan sebagai tautan biasa tanpa pratinjau.
    if (!title) {
        return (
            <a
                href={href}
                className={className}
                target="_blank"
                rel="noopener noreferrer"
            >
                {children}
            </a>
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
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <a
                href={href}
                className={`cursor-pointer border-b border-dashed border-sky-500/70 transition-colors hover:border-solid hover:border-sky-500 hover:text-sky-600 ${className || ''}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                {children}
            </a>

            <div
                className={`not-prose absolute bottom-full left-1/2 z-20 mb-2 w-80 -translate-x-1/2 transform overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl transition-all duration-300 ease-in-out ${isVisible ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible'}`}
                style={{ pointerEvents: 'none' }}
            >
                <div>
                    {imageSrc && (
                        <img
                            src={imageSrc}
                            alt={`Preview for ${title}`}
                            className="h-36 w-full object-cover bg-gray-100"
                        />
                    )}
                    <div className="p-3 text-left">
                        <h4 className="line-clamp-2 text-base font-semibold text-gray-800">{title}</h4>
                        {description && (
                            <p className="mt-1 line-clamp-3 text-sm text-gray-600">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </span>
    );
}

export default LinkPreview;