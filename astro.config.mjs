import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import expressiveCode from 'astro-expressive-code';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@tailwindcss/vite';

import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://sunblog.my.id',
  output: 'static',

  integrations: [
    react(),
    expressiveCode(),
    mdx(),
    sitemap({
      // Memaksa Astro menggabungkan semua URL ke dalam sitemap.xml tunggal
      entryLimit: 10000, 
    }),
  ],

  vite: {
    plugins: [tailwind()],
    server: {
      watch: {
        usePolling: true,
        interval: 100,
      },
    },
  },

  markdown: {
    remarkPlugins: [
      remarkGfm,
      remarkMath,
    ],

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
      [
        rehypeKatex,
        {
          macros: {
            "\\neq": "\\mathrel{\\unicode{x2260}}",
            "\\ne": "\\mathrel{\\unicode{x2260}}",
          },
        },
      ],
    ],
  },
});
