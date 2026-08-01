/* eslint-disable react/prop-types */
import React from 'react';

/**
 * Komponen generik untuk menampilkan daftar item dengan gambar, nama, dan deskripsi.
 * @param {object} props - Properti komponen.
 * @param {Array<object>} props.items - Array objek, di mana setiap objek harus memiliki `name`, `description`, dan `image`.
 */
function InfoList({ items }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="not-prose my-6 flex flex-col gap-4">
      {items.map(item => (
        <div key={item.name} className="flex items-center gap-4 rounded-lg bg-slate-100 p-3">
          <img src={item.image.src} alt={item.name} className="h-16 w-16 flex-shrink-0 rounded-md border border-gray-200 bg-white object-contain p-1" />
          <div className="flex-1">
            <p className="font-bold text-gray-900">{item.name}</p>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default InfoList;