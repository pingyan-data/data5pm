// @ts-check
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// DEPLOY_TARGET=custom → https://data5pm.com (root)
// otherwise            → https://pingyan-data.github.io/data5pm/
const isCustom = process.env.DEPLOY_TARGET === 'custom';

export default defineConfig({
  site: isCustom ? 'https://data5pm.com' : 'https://pingyan-data.github.io',
  base: isCustom ? '/' : '/data5pm',
  trailingSlash: 'always',
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
});