/* eslint-disable react/prop-types */
import React from 'react';

function RelatedPostCard({ path, title, thumbnail, publishDate, description, author, authorAvatar, category }) {
  return (
    <a href={path} className="group grid grid-cols-1 items-center gap-6 rounded-lg p-4 transition-all duration-300 hover:bg-white hover:shadow-md md:grid-cols-3">
      {/* Thumbnail */}
      <div className="relative col-span-1 overflow-hidden rounded-lg">
        <img
          className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={thumbnail}
          alt={`Thumbnail for ${title}`}
        />
      </div>

      {/* Content */}
      <div className="col-span-2 flex flex-col">
        <div>
          <span className="mb-2 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold capitalize text-orange-800">
            {category}
          </span>
          <h3 className="line-clamp-2 text-lg font-bold text-gray-900 group-hover:text-orange-600">
            {title}
          </h3>
          <p className="mt-2 text-sm text-gray-500 line-clamp-2">{description}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img className="h-8 w-8 rounded-full object-cover" src={authorAvatar} alt={`Avatar of ${author}`} />
            <p className="text-sm font-bold text-gray-900">{author}</p>
          </div>
          <p className="text-xs text-gray-500">{new Date(publishDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>
      </div>
    </a>
  );
}

export default RelatedPostCard;