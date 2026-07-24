/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import Logo from '@/assets/images/Sunblog.png';

import NavbarBackground from '@/assets/images/navbar-background.svg';
// Impor fungsi pencarian
import { searchPosts } from '@/utils/searchPosts';

/**
 * Komponen helper untuk meniru fungsionalitas NavLink dari React Router,
 * tetapi menggunakan tag <a> standar untuk Astro.
 */
function NavLink({ href, children, className, currentPath, onClick }) {
    // Tentukan apakah link aktif. Kasus khusus untuk beranda.
    const isActive = href === "/" ? currentPath === "/" : currentPath.startsWith(href);
    const finalClassName = typeof className === 'function' ? className({ isActive }) : className;
    return <a href={href} className={finalClassName} onClick={onClick}>{children}</a>;
}

function Header({ currentPath, posts }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [isSearchbarVisible, setIsSearchbarVisible] = useState(false);
    const searchInputRef = useRef(null);

    const categories = [...new Set(posts.map(p => p.category))];
    const closeMenu = () => setIsMenuOpen(false);

    // Fungsi untuk membuka panel pencarian
    const openSearchbar = () => {
        setIsSearchbarVisible(true);
    };

    // Fungsi untuk menutup panel pencarian dan mereset state
    const closeSearchbar = () => {
        setIsSearchbarVisible(false);
        setSearchQuery('');
        setSearchResults([]);
        setIsSearchActive(false);
    };

    // Efek untuk auto-focus pada input pencarian saat panel muncul
    useEffect(() => {
        if (isSearchbarVisible && searchInputRef.current) {
            // Tambahkan sedikit delay agar transisi CSS selesai sebelum fokus
            setTimeout(() => {
                searchInputRef.current.focus();
            }, 100);
        }
    }, [isSearchbarVisible]);

    // Fungsi untuk menangani perubahan input pencarian
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setSearchResults(searchPosts(query, posts));
        setIsSearchActive(query.length > 0);
    };

    // Fungsi untuk menutup panel saat hasil pencarian diklik
    const handleResultClick = () => {
        closeSearchbar();
        if (isMenuOpen) closeMenu(); // Tutup menu mobile jika terbuka
    };

    useEffect(() => {
        const handleScroll = () => {
            setHasScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-10 bg-white transition-shadow duration-300 ${hasScrolled ? 'shadow-md border-b-4 border-amber-400' : ''}`}>
            <div
                className="relative z-2"
                style={{
                    backgroundImage: `url(${NavbarBackground.src})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="max-w-[90rem] mx-auto flex flex-row justify-between items-center py-3 px-6">
                    <div className="flex-shrink-0">
                        <a href="/">
                            <img src={Logo.src} alt="Logo SunBlog" className="h-10 w-auto" />
                        </a>
                    </div>

                    {/* Navigasi Desktop & Pencarian */}
                    <div className="hidden lg:flex items-center gap-8">
                        <nav className="flex items-center gap-8 text-base">
                            <NavLink href="/" currentPath={currentPath} className={({ isActive }) => `py-2 transition-colors duration-200 ${isActive ? 'font-semibold text-white' : 'font-medium text-white/70 hover:text-orange-500'}`}>Beranda</NavLink>
                            <NavLink href="/blog" currentPath={currentPath} className={({ isActive }) => `py-2 transition-colors duration-200 ${isActive ? 'font-semibold text-white' : 'font-medium text-white/70 hover:text-orange-500'}`}>Blog</NavLink>
                            <NavLink href="/proyek" currentPath={currentPath} className={({ isActive }) => `py-2 transition-colors duration-200 ${isActive ? 'font-semibold text-white' : 'font-medium text-white/70 hover:text-orange-500'}`}>Proyek</NavLink>
                            <NavLink href="/about" currentPath={currentPath} className={({ isActive }) => `py-2 transition-colors duration-200 ${isActive ? 'font-semibold text-white' : 'font-medium text-white/70 hover:text-orange-500'}`}>Tentang</NavLink>
                            <NavLink href="/kontak" currentPath={currentPath} className={({ isActive }) => `py-2 transition-colors duration-200 ${isActive ? 'font-semibold text-white' : 'font-medium text-white/70 hover:text-orange-500'}`}>Kontak</NavLink>
                        </nav>

                        <button onClick={openSearchbar} aria-label="Buka pencarian" className="ml-4 rounded-full p-2 text-white transition-colors hover:bg-white/20">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-center gap-2 lg:hidden">
                        <button onClick={openSearchbar} aria-label="Buka pencarian" className="rounded-full p-2 text-white transition-colors hover:bg-white/20">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </button>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}>
                            {isMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Panel Pencarian */}
            {isSearchbarVisible && (
                <div
                    className="fixed inset-0 z-30 bg-black/40"
                    onClick={closeSearchbar}
                    aria-modal="true"
                    role="dialog"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-20 right-4 w-full max-w-md transform rounded-xl bg-white shadow-2xl transition-all sm:right-6"
                    >
                            <div className="flex items-center gap-4 px-4 py-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-gray-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                                <input
                                    ref={searchInputRef}
                                    type="search"
                                    placeholder="Cari artikel, tutorial, atau apapun..."
                                    className="w-full bg-transparent text-base placeholder:text-gray-400 focus:outline-none"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                                <button onClick={closeSearchbar} aria-label="Tutup pencarian" className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            {isSearchActive && (
                                <div className="max-h-[70vh] overflow-y-auto border-t border-gray-200">
                                    {searchResults.length > 0 ? (
                                        <ul>
                                            {searchResults.slice(0, 10).map(post => (
                                                <li key={post.path} className="border-b last:border-b-0">
                                                    <a href={post.path} onClick={handleResultClick} className="block p-4 transition-colors hover:bg-gray-50">
                                                        <p className="font-semibold text-gray-800 line-clamp-1">{post.metadata.title}</p>
                                                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{post.metadata.description}</p>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="p-6 text-center text-gray-500">
                                            Tidak ada hasil ditemukan untuk &quot;{searchQuery}&quot;
                                        </div>
                                    )}
                                </div>
                            )}
                    </div>
                </div>
            )}

            {/* Menu Mobile */}
            <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'} absolute w-full bg-white shadow-lg z-10`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <NavLink href="/" onClick={closeMenu} currentPath={currentPath} className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive ? 'text-orange-500 bg-orange-50' : 'text-gray-700 hover:text-orange-500 hover:bg-gray-50'}`}>Beranda</NavLink>
                    <NavLink href="/blog" onClick={closeMenu} currentPath={currentPath} className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive ? 'text-orange-500 bg-orange-50' : 'text-gray-700 hover:text-orange-500 hover:bg-gray-50'}`}>Blog</NavLink>
                    <NavLink href="/proyek" onClick={closeMenu} currentPath={currentPath} className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive ? 'text-orange-500 bg-orange-50' : 'text-gray-700 hover:text-orange-500 hover:bg-gray-50'}`}>Proyek</NavLink>
                    <NavLink href="/about" onClick={closeMenu} currentPath={currentPath} className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive ? 'text-orange-500 bg-orange-50' : 'text-gray-700 hover:text-orange-500 hover:bg-gray-50'}`}>Tentang</NavLink>
                    <NavLink href="/kontak" onClick={closeMenu} currentPath={currentPath} className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive ? 'text-orange-500 bg-orange-50' : 'text-gray-700 hover:text-orange-500 hover:bg-gray-50'}`}>Kontak</NavLink>
                </div>
                <div className="pt-4 pb-3 border-t border-gray-200">
                    <h3 className="px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</h3>
                    <div className="mt-2 space-y-1">
                        {categories.map(cat => (
                            <NavLink
                                key={cat}
                                href={`/blog/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                                onClick={closeMenu}
                                currentPath={currentPath}
                                className={({ isActive }) => `block px-5 py-2 text-base font-medium transition-colors capitalize ${isActive ? 'text-orange-500 bg-orange-50' : 'text-gray-600 hover:text-orange-500 hover:bg-gray-50'}`}
                            >
                                {cat}
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>

            <div className="hidden bg-slate-900 lg:block">
                <div className="max-w-[90rem] mx-auto flex flex-row items-center py-3 px-6">
                    <div className="mr-8">
                        <h1 className="font-bold text-xl text-white">KATEGORI BLOG</h1>
                    </div>
                    <div className="flex-1 min-w-0">
                        <nav className="flex flex-wrap gap-3">
                            {categories.map(cat => (
                                <NavLink
                                    key={cat}
                                    href={`/blog/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                                    currentPath={currentPath}
                                    className={({ isActive }) => `px-4 py-2 text-sm font-medium capitalize rounded-md ${isActive ? 'bg-orange-500 text-white shadow-md' : 'text-white bg-no-repeat bg-gradient-to-r from-amber-500 to-orange-500 bg-[length:0%_100%] hover:bg-[length:100%_100%] hover:text-white transition-[background-size,color] duration-300'}`}
                                >
                                    {cat}
                                </NavLink>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
