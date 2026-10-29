import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One entry = one method (or one overview page, like "Descriptive statistics").
// The frontmatter is the "decision record": what problem it solves and why I'd use it.
const toolbox = defineCollection({
  // Files starting with "_" (like _template.md) are ignored.
  loader: glob({ base: './src/content/toolbox', pattern: '**/[^_]*.md' }),
  schema: z.object({
    kind: z.enum(['method', 'story', 'note']).default('method').describe('story = a company case study, told as a story; note = an essay or study notes'),
    title: z.string(),
    summary: z.string().describe('One sentence: what it is.'),
    category: z.string(),
    status: z.enum(['seedling', 'growing', 'evergreen']).default('seedling'),
    created: z.coerce.date(),
    updated: z.coerce.date().optional(),
    order: z.number().optional().describe('Position inside its category. Lower comes first.'),

    problem: z.string().optional().describe('What question am I trying to answer? Required for methods.'),
    why: z.string().optional().describe('Why this method for that question? Required for methods.'),
    decides: z.string().optional().describe('Machine learning: how the model makes its decision.'),
    assumptions: z.array(z.string()).default([]),
    related: z.array(z.string()).default([]).describe('ids of other entries, e.g. statistics/bayes-theorem'),

    // Stories only
    company: z.string().optional(),
    source: z.object({ title: z.string(), url: z.string() }).optional(),

    references: z.array(z.object({ title: z.string(), url: z.string().optional() })).default([]),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }).superRefine((d, ctx) => {
    if (d.kind === 'method') {
      if (!d.problem) ctx.addIssue({ code: 'custom', path: ['problem'], message: 'Methods need a problem.' });
      if (!d.why) ctx.addIssue({ code: 'custom', path: ['why'], message: 'Methods need a why.' });
    }
  }),
});

export const collections = { toolbox };
