/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { authors } from '@/data/authors';

function PostCreatorForm() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        metaDescription: '',
        publishDate: new Date().toISOString().split('T')[0],
        author: 'Randy',
        category: '',
        subcategory: '',
        series: '',
        tags: '',
        imageCaption: '',
        readingTime: 5,
        difficulty: 'Pemula',
        platform: '',
        contentType: 'Penjelasan',
        featured: false,
        sources: [{ name: '', url: '' }], // Ubah menjadi array of objects
    });
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [status, setStatus] = useState({ type: 'idle', message: '' });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSourceChange = (index, field, value) => {
        const updatedSources = [...formData.sources];
        updatedSources[index][field] = value;
        setFormData(prev => ({ ...prev, sources: updatedSources }));
    };

    const addSource = () => {
        setFormData(prev => ({
            ...prev,
            sources: [...prev.sources, { name: '', url: '' }]
        }));
    };

    const removeSource = (index) => {
        const filteredSources = formData.sources.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, sources: filteredSources.length > 0 ? filteredSources : [{ name: '', url: '' }] }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            const reader = new FileReader();
            reader.onloadend = () => setThumbnailPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!thumbnail) {
            setStatus({ type: 'error', message: 'Thumbnail wajib diunggah.' });
            return;
        }
        setStatus({ type: 'submitting', message: 'Membuat artikel...' });

        const submissionData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'sources') {
                // Filter sumber yang benar-benar kosong sebelum mengirim
                const validSources = value.filter(source => source.name.trim() !== '' && source.url.trim() !== '');
                submissionData.append(key, JSON.stringify(validSources));
            } else {
                submissionData.append(key, value);
            }
        });
        submissionData.append('thumbnail', thumbnail);

        try {
            const response = await fetch('/api/create-post', {
                method: 'POST',
                body: submissionData,
            });
            const result = await response.json();

            if (!response.ok) throw new Error(result.error || 'Gagal membuat artikel.');
            
            setStatus({ type: 'success', message: `${result.message} Mengalihkan...` });
            setTimeout(() => window.location.href = result.url, 2000);
        } catch (error) {
            setStatus({ type: 'error', message: error.message });
        }
    };

    // Style standar yang seragam untuk seluruh input biasa
    const inputStyle = "w-full min-h-[48px] px-4 py-3 text-base text-gray-800 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all duration-200 placeholder:text-gray-400";
    
    // Style standar untuk textarea agar lebih luas
    const textareaStyle = "w-full px-4 py-3 text-base text-gray-800 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all duration-200 placeholder:text-gray-400 min-h-[120px]";

    const difficultyOptions = ["Pemula", "Menengah", "Lanjutan"];
    const contentTypeOptions = [
        "Penjelasan", "Panduan", "Tutorial", "Tips", "Review", "Perbandingan",
        "Daftar", "Opini", "Analisis", "Berita", "Referensi", "FAQ",
        "Studi Kasus", "Inspirasi"
    ];

    return (
        <div className="max-w-4xl mx-auto my-10 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 bg-orange-400 text-white">
                <h1 className="text-3xl font-bold">Buat Artikel Baru</h1>
                <p className="text-orange-100 text-sm mt-1">Halaman ini hanya tersedia di mode development.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                
                {/* 1. Judul Artikel (Full Width, Ekstra Tinggi) */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="title" className="text-sm font-semibold text-gray-700">
                        Judul Artikel
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className={`${inputStyle} text-lg font-medium min-h-[52px]`}
                        placeholder="Masukkan judul artikel yang jelas dan menarik..."
                    />
                </div>

                {/* 2. Deskripsi & Meta SEO (Grid 2 Kolom Seimbang) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="description" className="text-sm font-semibold text-gray-700">
                            Deskripsi Singkat
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            required
                            value={formData.description}
                            onChange={handleChange}
                            className={textareaStyle}
                            placeholder="Ringkasan isi artikel untuk pembaca..."
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="metaDescription" className="text-sm font-semibold text-gray-700">
                            Deskripsi SEO (Meta)
                        </label>
                        <textarea
                            name="metaDescription"
                            id="metaDescription"
                            required
                            value={formData.metaDescription}
                            onChange={handleChange}
                            className={textareaStyle}
                            placeholder="Deskripsi ringkas untuk mesin pencari (120-160 karakter)..."
                        />
                    </div>
                </div>

                {/* 3. Kategori & Sub-kategori */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="category" className="text-sm font-semibold text-gray-700">
                            Kategori
                        </label>
                        <input
                            type="text"
                            name="category"
                            id="category"
                            required
                            value={formData.category}
                            onChange={handleChange}
                            className={inputStyle}
                            placeholder="e.g. Teknologi"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="subcategory" className="text-sm font-semibold text-gray-700">
                            Sub-kategori <span className="font-normal text-gray-400">(Opsional)</span>
                        </label>
                        <input
                            type="text"
                            name="subcategory"
                            id="subcategory"
                            value={formData.subcategory}
                            onChange={handleChange}
                            className={inputStyle}
                            placeholder="e.g. Astro"
                        />
                    </div>
                </div>

                {/* 4. Penulis & Seri Artikel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="author" className="text-sm font-semibold text-gray-700">
                            Penulis
                        </label>
                        <div className="relative">
                            <select
                                name="author"
                                id="author"
                                required
                                value={formData.author}
                                onChange={handleChange}
                                className={`${inputStyle} appearance-none cursor-pointer pr-10`}
                            >
                                {Object.keys(authors).map(key => (
                                    <option key={key} value={key}>{authors[key].fullName}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                ▼
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="series" className="text-sm font-semibold text-gray-700">
                            Seri Artikel <span className="font-normal text-gray-400">(Opsional)</span>
                        </label>
                        <input
                            type="text"
                            name="series"
                            id="series"
                            value={formData.series}
                            onChange={handleChange}
                            className={inputStyle}
                            placeholder="e.g. Belajar Astro Dasar"
                        />
                    </div>
                </div>

                {/* 5. Tags */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="tags" className="text-sm font-semibold text-gray-700">
                        Tags <span className="font-normal text-gray-400">(Pisahkan dengan koma)</span>
                    </label>
                    <input
                        type="text"
                        name="tags"
                        id="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        className={inputStyle}
                        placeholder="Cloud, AWS, Google Cloud"
                    />
                </div>

                {/* 5. Detail Tambahan (Waktu Baca, Kesulitan, Tipe Konten) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="readingTime" className="text-sm font-semibold text-gray-700">
                            Waktu Baca (menit)
                        </label>
                        <input
                            type="number"
                            name="readingTime"
                            id="readingTime"
                            required
                            value={formData.readingTime}
                            onChange={handleChange}
                            className={inputStyle}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="difficulty" className="text-sm font-semibold text-gray-700">
                            Tingkat Kesulitan
                        </label>
                        <div className="relative">
                            <select
                                name="difficulty"
                                id="difficulty"
                                required
                                value={formData.difficulty}
                                onChange={handleChange}
                                className={`${inputStyle} appearance-none cursor-pointer pr-10`}
                            >
                                {difficultyOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">▼</div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="contentType" className="text-sm font-semibold text-gray-700">
                            Tipe Konten
                        </label>
                        <div className="relative">
                            <select
                                name="contentType"
                                id="contentType"
                                required
                                value={formData.contentType}
                                onChange={handleChange}
                                className={`${inputStyle} appearance-none cursor-pointer pr-10`}
                            >
                                {contentTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">▼</div>
                        </div>
                    </div>
                </div>

                {/* 6. Platform & Tanggal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="platform" className="text-sm font-semibold text-gray-700">
                            Platform <span className="font-normal text-gray-400">(Opsional, pisahkan koma)</span>
                        </label>
                        <input
                            type="text"
                            name="platform"
                            id="platform"
                            value={formData.platform}
                            onChange={handleChange}
                            className={inputStyle}
                            placeholder="e.g. Windows, Android"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="publishDate" className="text-sm font-semibold text-gray-700">
                            Tanggal Publikasi
                        </label>
                        <input
                            type="date"
                            name="publishDate"
                            id="publishDate"
                            required
                            value={formData.publishDate}
                            onChange={handleChange}
                            className={`${inputStyle} cursor-pointer`}
                        />
                    </div>
                </div>

                {/* 6. Upload Thumbnail */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Thumbnail</label>
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100/50 transition-colors">
                        <div className="w-full sm:w-48 h-28 rounded-lg border border-gray-200 bg-white overflow-hidden flex items-center justify-center shrink-0">
                            {thumbnailPreview ? (
                                <img className="w-full h-full object-cover" src={thumbnailPreview} alt="Preview" />
                            ) : (
                                <span className="text-xs text-gray-400 font-medium">Belum ada gambar</span>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <label htmlFor="thumbnail" className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 bg-white border border-gray-300 rounded-xl font-semibold text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition-all shadow-sm w-fit">
                                Pilih File Gambar
                                <input
                                    id="thumbnail"
                                    name="thumbnail"
                                    type="file"
                                    required
                                    className="sr-only"
                                    accept="image/webp, image/jpeg, image/png"
                                    onChange={handleFileChange}
                                />
                            </label>
                            <p className="text-xs text-gray-500">Mendukung format WEBP, JPEG, dan PNG.</p>
                        </div>
                    </div>
                </div>

                {/* 7. Keterangan Gambar & Featured */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="imageCaption" className="text-sm font-semibold text-gray-700">
                            Keterangan Gambar <span className="font-normal text-gray-400">(Opsional)</span>
                        </label>
                        <input
                            type="text"
                            name="imageCaption"
                            id="imageCaption"
                            value={formData.imageCaption}
                            onChange={handleChange}
                            className={inputStyle}
                            placeholder="e.g. Ilustrasi..."
                        />
                    </div>
                    <div className="flex items-center gap-3 self-end mb-2">
                        <input
                            type="checkbox"
                            name="featured"
                            id="featured"
                            checked={formData.featured}
                            onChange={handleChange}
                            className="h-5 w-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                        />
                        <label htmlFor="featured" className="text-sm font-semibold text-gray-700 cursor-pointer">
                            Jadikan Artikel Pilihan (Featured)?
                        </label>
                    </div>
                </div>

                {/* 8. Sumber Referensi */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Sumber Referensi</label>
                    <div className="space-y-4 p-4 border border-gray-200 rounded-xl bg-gray-50/50">
                        {formData.sources.map((source, index) => (
                            <div key={index} className="flex flex-col md:flex-row items-start gap-4">
                                <div className="flex-1 w-full">
                                    <label htmlFor={`source-name-${index}`} className="sr-only">Nama Sumber</label>
                                    <input
                                        type="text"
                                        id={`source-name-${index}`}
                                        value={source.name}
                                        onChange={(e) => handleSourceChange(index, 'name', e.target.value)}
                                        className={inputStyle}
                                        placeholder="Nama Sumber (e.g. Wikipedia)"
                                    />
                                </div>
                                <div className="flex-1 w-full">
                                    <label htmlFor={`source-url-${index}`} className="sr-only">URL Sumber</label>
                                    <input
                                        type="url"
                                        id={`source-url-${index}`}
                                        value={source.url}
                                        onChange={(e) => handleSourceChange(index, 'url', e.target.value)}
                                        className={inputStyle}
                                        placeholder="https://..."
                                    />
                                </div>
                                <button type="button" onClick={() => removeSource(index)} className="h-12 w-12 flex-shrink-0 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors" aria-label="Hapus sumber">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={addSource} className="w-full mt-2 px-4 py-2.5 bg-orange-100 text-orange-700 font-semibold text-sm rounded-lg hover:bg-orange-200 transition-colors">
                            + Tambah Sumber
                        </button>
                    </div>
                </div>


                {/* Submit Bar */}
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-end gap-4">
                    {status.type !== 'idle' ? (
                        <p className={`text-sm font-semibold ${status.type === 'error' ? 'text-red-600' : 'text-emerald-600'}`}>
                            {status.message}
                        </p>
                    ) : <div />}

                    <button
                        type="submit"
                        disabled={status.type === 'submitting'}
                        className="w-full sm:w-auto min-h-[48px] px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-base rounded-xl shadow-md transition-all focus:ring-4 focus:ring-orange-200 disabled:bg-orange-300 cursor-pointer"
                    >
                        {status.type === 'submitting' ? 'Memproses...' : 'Buat Artikel'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PostCreatorForm;