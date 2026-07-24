/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import Logo from '@/assets/images/Sunblog_Black.png';

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
    const searchContainerRef = useRef(null);

    const categories = [...new Set(posts.map(p => p.category))];
    const closeMenu = () => setIsMenuOpen(false);

    // Efek untuk menangani klik di luar area pencarian untuk menutup hasil
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsSearchActive(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [searchContainerRef]);

    // Fungsi untuk menangani perubahan input pencarian
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setSearchResults(searchPosts(query, posts));
        setIsSearchActive(query.length > 0);
    };

    // Fungsi untuk mereset state pencarian saat hasil diklik
    const handleResultClick = () => {
        setSearchQuery('');
        setSearchResults([]);
        setIsSearchActive(false);
        if (isMenuOpen) closeMenu(); // Tutup menu mobile jika terbuka
    };

    useEffect(() => {
        const handleScroll = () => {
            setHasScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Hitung lebar yang akan dirender berdasarkan tinggi CSS (h-14 = 56px) dan rasio aspek asli gambar
    // Ini untuk mencegah Cumulative Layout Shift (CLS)
    const desiredRenderedHeight = 56; // h-14 is 3.5rem, assuming 1rem = 16px
    const calculatedRenderedWidth = (Logo.width / Logo.height) * desiredRenderedHeight;

    return (
        <header className={`sticky top-0 z-10 bg-white transition-all duration-300 border-b-4 ${hasScrolled ? 'shadow-md border-amber-400' : 'border-transparent'}`}>
            <div className="relative z-20 bg-slate-800">
                <div className="max-w-[90rem] mx-auto flex flex-row justify-between items-center py-3 px-6">
                    <div className="flex-shrink-0">
                        <a href="/">
                            <img
                                src={Logo.src}
                                alt="Logo SunBlog"
                                className="h-14 w-auto"
                                width={calculatedRenderedWidth}
                                height={desiredRenderedHeight} />
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
                        <div className="relative ml-2" ref={searchContainerRef}>
                            <input
                                type="search"
                                placeholder="Cari..."
                                className="w-64 rounded-full border border-gray-600 bg-slate-700 py-2 pl-9 pr-4 text-sm text-white transition-colors focus:border-orange-500 focus:bg-slate-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => setIsSearchActive(searchQuery.length > 0)}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>

                            {isSearchActive && (
                                <div className="absolute right-0 z-20 mt-2 w-96 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                                    <div className="max-h-96 overflow-y-auto">
                                        {searchResults.length > 0 ? (
                                            <ul>
                                                {searchResults.slice(0, 10).map(post => (
                                                    <li key={post.path}>
                                                        <a
                                                            href={post.path}
                                                            onClick={handleResultClick}
                                                            className="flex items-start gap-4 border-b border-gray-100 p-3 transition-colors last:border-b-0 hover:bg-gray-50"
                                                        >
                                                            <img src={post.metadata.thumbnail.src} alt={`Thumbnail for ${post.metadata.title}`} className="aspect-video w-20 flex-shrink-0 rounded-md object-cover" />
                                                            <div>
                                                                <p className="line-clamp-2 text-sm font-semibold leading-tight text-gray-800">{post.metadata.title}</p>
                                                                <p className="mt-1 line-clamp-1 text-xs text-gray-500">{post.metadata.description}</p>
                                                            </div>
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="p-6 text-center text-gray-500"><p className="font-semibold">Tidak ada hasil ditemukan</p><p className="text-sm">Coba gunakan kata kunci yang berbeda.</p></div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:hidden">
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

            {/* Menu Mobile */}
            <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'} absolute w-full bg-white shadow-lg z-10`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <div className="px-2 pb-2">
                        {/* Saat di mobile, ref hanya akan aktif jika menu terbuka */}
                        <div className="relative" ref={isMenuOpen ? searchContainerRef : null}>
                            <input
                                type="search"
                                placeholder="Cari..."
                                className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-9 pr-4 text-sm transition-colors focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => setIsSearchActive(searchQuery.length > 0)}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>

                            {isSearchActive && (
                                <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                                    <div className="max-h-80 overflow-y-auto">
                                        {searchResults.length > 0 ? (
                                            <ul>
                                                {searchResults.slice(0, 7).map(post => (
                                                    <li key={post.path}>
                                                        <a
                                                            href={post.path}
                                                            onClick={handleResultClick}
                                                            className="flex items-start gap-3 border-b border-gray-100 p-3 transition-colors last:border-b-0 hover:bg-gray-50"
                                                        >
                                                            <img src={post.metadata.thumbnail.src} alt={`Thumbnail for ${post.metadata.title}`} className="aspect-video w-16 flex-shrink-0 rounded object-cover" />
                                                            <div>
                                                                <p className="line-clamp-2 text-sm font-semibold leading-tight text-gray-800">{post.metadata.title}</p>
                                                                <p className="mt-1 line-clamp-2 text-xs text-gray-500">{post.metadata.description}</p>
                                                            </div>
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="p-4 text-center text-sm text-gray-500">Tidak ada hasil ditemukan.</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
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
                                    className={({ isActive }) => `px-4 py-2 text-sm font-medium capitalize rounded-md ${isActive ? 'bg-orange-500 text-white shadow-md' : 'text-slate-300 bg-no-repeat bg-gradient-to-r from-amber-500 to-orange-500 bg-[length:0%_100%] hover:bg-[length:100%_100%] hover:text-white transition-[background-size,color] duration-300'}`}
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
