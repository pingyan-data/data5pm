import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One entry = one method. The frontmatter is the "decision record":
// every entry must say what problem it solves, why this method, and why not the others.
const toolbox = defineCollection({
  // Files starting with "_" (like _template.md) are ignored.
  loader: glob({ base: './src/content/toolbox', pattern: '**/[^_]*.md' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().describe('One sentence: what it is.'),
    category: z.string(),
    status: z.enum(['seedling', 'growing', 'evergreen']).default('seedling'),
    created: z.coerce.date(),
    updated: z.coerce.date().optional(),

    problem: z.string().describe('What question am I trying to answer?'),
    why: z.string().describe('Why this method for that question?'),
    alternatives: z
      .array(
        z.object({
          method: z.string(),
          whyNot: z.string(),
          entry: z.string().optional().describe('id of another entry, e.g. statistics/mann-whitney-u'),
        }),
      )
      .default([]),
    assumptions: z.array(z.string()).default([]),

    references: z.array(z.object({ title: z.string(), url: z.string().optional() })).default([]),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { toolbox };
