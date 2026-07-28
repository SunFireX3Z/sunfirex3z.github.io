import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import expressiveCode from 'astro-expressive-code';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@tailwindcss/vite';

import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export default defineConfig({
  site: 'https://sunblog.my.id',

  output: 'static',

  integrations: [
    react(),
    expressiveCode(),
    mdx(),
    sitemap()
  ],

  vite: {
    plugins: [tailwind()]
  },

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