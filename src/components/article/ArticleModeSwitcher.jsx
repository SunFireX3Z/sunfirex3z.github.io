/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';

const MODE_STORAGE_KEY = 'sunblog_article_mode';

function ArticleModeSwitcher({ authorName }) {
  // Default ke mode 'formal' (Standard)
  const [mode, setMode] = useState('formal');

  const authorFirstName = authorName ? authorName.split(' ')[0] : 'Author';

  // Saat komponen pertama kali dimuat, periksa sessionStorage untuk preferensi yang tersimpan
  useEffect(() => {
    const savedMode = sessionStorage.getItem(MODE_STORAGE_KEY);
    const initialMode = savedMode || 'formal'; // Default ke 'formal' jika tidak ada yang tersimpan
    setMode(initialMode);
    
    // Terapkan class ke body
    if (initialMode === 'formal') {
      document.body.classList.add('formal-mode');
      document.body.classList.remove('author-mode');
    } else {
      document.body.classList.add('author-mode');
      document.body.classList.remove('formal-mode');
    }
  }, []);

  const toggleMode = () => {
    const newMode = mode === 'author' ? 'formal' : 'author';
    setMode(newMode);
    sessionStorage.setItem(MODE_STORAGE_KEY, newMode);

    if (newMode === 'formal') {
      document.body.classList.add('formal-mode');
      document.body.classList.remove('author-mode');
    } else {
      document.body.classList.add('author-mode');
      document.body.classList.remove('formal-mode');
    }
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <span className={`text-sm font-semibold transition-colors ${mode === 'formal' ? 'text-slate-800' : 'text-gray-500'}`}>Standard</span>
      <button onClick={toggleMode} className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${mode === 'author' ? 'bg-orange-500' : 'bg-slate-800'}`} role="switch" aria-checked={mode === 'author'}>
        <span aria-hidden="true" className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${mode === 'author' ? 'translate-x-5' : 'translate-x-0'}`}></span>
      </button>
      <span className={`text-sm font-semibold transition-colors ${mode === 'author' ? 'text-orange-600' : 'text-gray-500'}`}>{authorFirstName}'s Style</span>
    </div>
  );
}

export default ArticleModeSwitcher;