/* eslint-disable react/prop-types */
import React from 'react';

function ArticleModeSwitcher({ authorName, currentMode, basePath }) {
  // currentMode akan datang dari props (berdasarkan URL)
  // basePath adalah URL artikel tanpa '/author'

  const authorFirstName = authorName ? authorName.split(' ')[0] : 'Author';

  const formalUrl = basePath;
  const authorUrl = `${basePath}/author`;

  // URL tujuan saat toggle diklik
  const toggleUrl = currentMode === 'formal' ? authorUrl : formalUrl;

  return (
    <div className="flex items-center justify-center gap-4">
      <a
        href={formalUrl}
        className={`text-sm font-semibold transition-colors ${currentMode === 'formal' ? 'text-slate-800' : 'text-gray-500 hover:text-orange-500'}`}
        aria-current={currentMode === 'formal' ? 'page' : undefined}
      >
        Standard
      </a>
      <a
        href={toggleUrl}
        role="switch"
        aria-checked={currentMode === 'author'}
        aria-label={`Beralih ke mode ${currentMode === 'formal' ? "Author's Style" : "Standard"}`}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${currentMode === 'author' ? 'bg-orange-500' : 'bg-slate-800'}`}
      >
        <span aria-hidden="true" className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${currentMode === 'author' ? 'translate-x-5' : 'translate-x-0'}`}></span>
      </a>
      <a
        href={authorUrl}
        className={`text-sm font-semibold transition-colors ${currentMode === 'author' ? 'text-orange-600' : 'text-gray-500 hover:text-orange-500'}`}
        aria-current={currentMode === 'author' ? 'page' : undefined}
      >
        {authorFirstName}'s Style
      </a>
    </div>
  );
}

export default ArticleModeSwitcher;