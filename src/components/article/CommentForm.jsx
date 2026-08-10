/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from 'react';

// TODO: Ganti dengan URL Web App dari Google Apps Script Anda.
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwmJtLZWAVOJnTG69X55SqkMPrYfj91X00TMwJy-vk72AkAYcETEQXu73RXjS8yrV3fVw/exec";

// Ganti nilai ini dengan Site Key dari Dashboard Cloudflare Turnstile Anda
const TURNSTILE_SITE_KEY = "0x4AAAAAAEFFe1W3uVJrqWoD";

// Fungsi untuk menampilkan notifikasi toast, diadaptasi dari kontak.astro
function showToast(message, type = 'success') {
    const existingToast = document.getElementById('toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'fixed top-5 right-5 z-50 flex items-center w-full max-w-xs p-4 space-x-4 rtl:space-x-reverse text-gray-600 bg-white rounded-lg shadow-xl transition-all duration-300 opacity-0 -translate-y-5';
    toast.setAttribute('role', 'alert');

    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg';

    if (type === 'success') {
        iconWrapper.classList.add('bg-green-100', 'text-green-500');
        iconWrapper.innerHTML = `<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/></svg>`;
    } else {
        iconWrapper.classList.add('bg-red-100', 'text-red-500');
        iconWrapper.innerHTML = `<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/></svg>`;
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = 'ms-3 text-sm font-normal';
    messageDiv.textContent = message;

    toast.append(iconWrapper, messageDiv);
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 100);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-1.25rem)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

const CommentForm = ({ articleTitle, articleUrl }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        comment: '',
    });
    const [status, setStatus] = useState('idle'); // 'idle', 'submitting', 'success', 'error'
    const formRef = useRef(null);

    useEffect(() => {
        // Karena komponen ini dimuat dengan `client:visible`, widget Turnstile
        // perlu dirender secara eksplisit setelah komponen muncul di layar.
        // Script global Turnstile mungkin sudah berjalan sebelum div ini ada.
        if (typeof window.turnstile !== 'undefined') {
            const container = document.getElementById('turnstile-widget-container');
            // Pastikan widget belum ada untuk menghindari duplikasi saat HMR (Hot Module Replacement)
            if (container && container.innerHTML === '') {
                window.turnstile.render(container, {
                    sitekey: TURNSTILE_SITE_KEY,
                    theme: 'light',
                });
            }
        }
    }, []); // Array kosong memastikan ini hanya berjalan sekali saat komponen dimuat

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        const data = new FormData(formRef.current);
        data.append('timestamp', new Date().toISOString());
        data.append('articleTitle', articleTitle);
        data.append('articleUrl', articleUrl);

        // Cek token Turnstile sebelum mengirim
        const turnstileToken = data.get('cf-turnstile-response');
        if (!turnstileToken) {
            showToast('Harap selesaikan verifikasi keamanan.', 'error');
            setStatus('error');
            return;
        }

        try {
            // Menggunakan mode 'no-cors' agar tidak terblokir oleh kebijakan CORS di localhost.
            // Dalam mode ini, kita tidak bisa membaca respons dari server,
            // jadi kita asumsikan sukses jika fetch tidak melempar error jaringan.
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', 
                body: data,
            });

            // Jika fetch berhasil tanpa error jaringan, asumsikan pengiriman sukses.
            showToast('Komentar Anda berhasil terkirim dan akan ditampilkan setelah moderasi.', 'success');
            setStatus('success');
            setFormData({ name: '', email: '', comment: '' }); // Reset form
            if (typeof window.turnstile !== 'undefined') {
                window.turnstile.reset();
            }
        } catch (error) {
            // Tangani error jaringan (misal: tidak ada koneksi internet)
            console.error('Submission error:', error);
            showToast('Gagal mengirim komentar. Periksa koneksi internet Anda.', 'error');
            setStatus('error');
        }
    };

    return (
        <div className="not-prose mt-12 rounded-lg bg-white p-6 shadow-md border-t-4 border-orange-400">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Tinggalkan Komentar</h3>

            <form ref={formRef} onSubmit={handleSubmit} name="submit-to-google-sheet">
                {/* Tidak perlu input tersembunyi, data dikirim via FormData di JS */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                        <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-sm px-3 py-2" placeholder="Nama Anda" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-sm px-3 py-2" placeholder="email@example.com" />
                         <p className="mt-1 text-xs text-gray-500">Email Anda tidak akan dipublikasikan.</p>
                    </div>
                </div>
                <div className="mt-6">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Komentar</label>
                    <textarea id="comment" name="comment" rows="4" required value={formData.comment} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-sm px-3 py-2" placeholder="Tulis komentar Anda di sini..."></textarea>
                </div>

                {/* Widget Cloudflare Turnstile */}
                <div id="turnstile-widget-container" className="mt-6"></div>

                <div className="mt-6 flex items-center justify-end gap-4">
                    {/* Pesan error/sukses sekarang ditangani oleh toast */}
                    <button type="submit" disabled={status === 'submitting'} className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-6 py-2.5 text-base font-bold text-white shadow-md transition-all duration-300 hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300 disabled:cursor-not-allowed disabled:bg-orange-400">
                        {status === 'submitting' ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Mengirim...
                            </>
                        ) : 'Kirim Komentar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CommentForm;