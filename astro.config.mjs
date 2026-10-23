// @ts-check
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Live at https://data5pm.com (custom domain on GitHub Pages).
// The old https://pingyan-data.github.io/data5pm/ address redirects here automatically.
export default defineConfig({
  site: 'https://data5pm.com',
  base: '/',
  trailingSlash: 'always',
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
});