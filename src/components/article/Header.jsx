/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import Logo from '@/assets/images/Sunblog.png';

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

    return (
        <header className={`sticky top-0 z-10 bg-white transition-shadow duration-300 ${hasScrolled ? 'shadow-md border-b-2 border-amber-500' : ''}`}>
            <div className="bg-white relative">
                {/* Latar belakang yang membentang ke kanan. Lebarnya dibuat responsif agar selalu mencakup navigasi. */}
                <div className="hidden lg:block absolute inset-y-0 right-0 rounded-l-full bg-gradient-to-l from-amber-500 to-orange-500 shadow-inner lg:w-3/4" />

                <div className="relative max-w-[90rem] mx-auto flex flex-row justify-between items-center py-3 px-6">
                    <div className="flex-shrink-0">
                        <a href="/">
                            <img src={Logo.src} alt="Logo SunBlog" className="h-10 w-auto" />
                        </a>
                    </div>

                    {/* Navigasi Desktop & Pencarian */}
                    <div className="hidden lg:flex items-center gap-6 pl-8 pr-3 py-2">
                        <nav className="flex gap-8">
                            <NavLink href="/" currentPath={currentPath} className={({ isActive }) => `font-medium transition-colors ${isActive ? 'text-white underline underline-offset-8 decoration-2' : 'text-white/70 hover:text-white'}`}>Beranda</NavLink>
                            <NavLink href="/blog" currentPath={currentPath} className={({ isActive }) => `font-medium transition-colors ${isActive ? 'text-white underline underline-offset-8 decoration-2' : 'text-white/70 hover:text-white'}`}>Blog</NavLink>
                            <NavLink href="/proyek" currentPath={currentPath} className={({ isActive }) => `font-medium transition-colors ${isActive ? 'text-white underline underline-offset-8 decoration-2' : 'text-white/70 hover:text-white'}`}>Proyek</NavLink>
                            <NavLink href="/about" currentPath={currentPath} className={({ isActive }) => `font-medium transition-colors ${isActive ? 'text-white underline underline-offset-8 decoration-2' : 'text-white/70 hover:text-white'}`}>Tentang</NavLink>
                            <NavLink href="/kontak" currentPath={currentPath} className={({ isActive }) => `font-medium transition-colors ${isActive ? 'text-white underline underline-offset-8 decoration-2' : 'text-white/70 hover:text-white'}`}>Kontak</NavLink>
                        </nav>

                        <div className="relative ml-2" ref={searchContainerRef}>
                            <input
                                type="search"
                                placeholder="Cari..."
                                className="pl-9 pr-4 py-2 bg-white border-none rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => setIsSearchActive(searchQuery.length > 0)}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>

                            {isSearchActive && (
                                <div className="absolute mt-2 w-96 max-h-96 overflow-y-auto rounded-lg bg-white shadow-lg z-20 right-0 border border-gray-100">
                                    {searchResults.length > 0 ? (
                                        <ul>
                                            {searchResults.slice(0, 10).map(post => ( // Batasi hasil yang ditampilkan
                                                <li key={post.path} className="border-b last:border-b-0">
                                                    <a
                                                        href={post.path}
                                                        onClick={handleResultClick}
                                                        className="block p-4 transition-colors hover:bg-gray-50"
                                                    >
                                                        <p className="font-semibold text-gray-800 line-clamp-1">{post.metadata.title}</p>
                                                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{post.metadata.description}</p>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="p-4 text-center text-gray-500">Tidak ada hasil ditemukan untuk &quot;{searchQuery}&quot;</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tombol Hamburger */}
                    <div className="lg:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Buka menu">
                            {isMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
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
                                className="w-full pl-9 pr-4 py-1.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => setIsSearchActive(searchQuery.length > 0)}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>

                            {isSearchActive && (
                                <div className="absolute mt-2 w-full max-h-80 overflow-y-auto rounded-lg bg-white shadow-lg z-20 border border-gray-100">
                                    {searchResults.length > 0 ? (
                                        <ul>
                                            {searchResults.slice(0, 7).map(post => (
                                                <li key={post.path} className="border-b last:border-b-0">
                                                    <a
                                                        href={post.path}
                                                        onClick={handleResultClick}
                                                        className="block p-3 transition-colors hover:bg-gray-50"
                                                    >
                                                        <p className="font-semibold text-gray-800 line-clamp-1">{post.metadata.title}</p>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="p-3 text-center text-sm text-gray-500">Tidak ada hasil ditemukan.</div>
                                    )}
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

            <div className="bg-white hidden lg:block">
                <div className="max-w-[90rem] mx-auto flex flex-row items-center py-3 px-6">
                    <div className="mr-8">
                        <h1 className="font-bold text-xl text-black">Kategori Blog</h1>
                    </div>
                    <div className="flex-1 min-w-0">
                        <nav className="flex flex-wrap gap-3">
                            {categories.map(cat => (
                                <NavLink
                                    key={cat}
                                    href={`/blog/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                                    currentPath={currentPath}
                                    className={({ isActive }) => `px-4 py-2 text-sm font-medium capitalize rounded-md ${isActive ? 'bg-orange-500 text-white shadow-md' : 'text-gray-600 bg-no-repeat bg-gradient-to-r from-amber-500 to-orange-500 bg-[length:0%_100%] hover:bg-[length:100%_100%] hover:text-white transition-[background-size,color] duration-300'}`}
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
