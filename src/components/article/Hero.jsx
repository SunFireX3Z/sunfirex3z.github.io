import React from 'react';

function Hero() {
    return (
        <section className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
                <h1 className="text-5xl font-bold leading-tight">Selamat Datang di SunBlog</h1>
                <p className="mt-5 text-gray-600 text-lg">Tempat berbagi artikel tentang programming, teknologi, dan project yang sedang dibuat.</p>
                <button className="mt-8 rounded-lg bg-black px-6 py-3 text-white">
                    Baca Sekarang
                </button>
            </div>
            <div className="flex-1">
                <img src="./assets/hero.png" alt="hero" className="w-full rounded-2xl" />
            </div>
        </section>
    )
}

export default Hero;