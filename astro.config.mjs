import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import expressiveCode from 'astro-expressive-code';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@tailwindcss/vite';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// https://astro.build/config
export default defineConfig({
  // Atur URL situs final Anda
  site: 'https://sunfirex3z.github.io/',
  
  // Daftar integrasi
  integrations: [react(), expressiveCode(), mdx(), sitemap()],

  // Konfigurasi spesifik Vite
  vite: {
    plugins: [tailwind()]
  },

  // Konfigurasi Markdown dan MDX
  markdown: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            className: ["heading-anchor-link"],
            "aria-hidden": "true",
            tabIndex: -1,
          },
          content: {
            type: "text",
            value: "",
          },
        },
      ],
    ],
  },
});