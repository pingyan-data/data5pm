// @ts-check
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// GitHub Pages project site: https://pingyan-data.github.io/data5pm/
// When you add a custom domain (e.g. data5pm.com), set site to that domain and base to '/'.
export default defineConfig({
  site: 'https://pingyan-data.github.io',
  base: '/data5pm',
  trailingSlash: 'always',
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
});
