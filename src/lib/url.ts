// Prefixes internal paths with the site base (`base` in astro.config.mjs, currently '/')
// and adds the trailing slash, so links keep working if the site ever moves to a sub-path.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function url(path = '/'): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p.endsWith('/') || p.includes('#') || p.includes('.') ? p : `${p}/`}`;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
