import { getCollection, type CollectionEntry } from 'astro:content';

export type Entry = CollectionEntry<'toolbox'>;

export const domainOf = (e: Entry) => e.id.split('/')[0];
export const lastTouched = (e: Entry) => e.data.updated ?? e.data.created;

// Drafts show in `npm run dev` but never in the built site.
export async function getEntries(domain?: string): Promise<Entry[]> {
  const all = await getCollection('toolbox', (e) => import.meta.env.DEV || !e.data.draft);
  return all
    .filter((e) => !domain || domainOf(e) === domain)
    .sort((a, b) => lastTouched(b).getTime() - lastTouched(a).getTime());
}
