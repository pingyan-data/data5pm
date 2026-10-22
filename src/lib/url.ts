// Prefixes internal paths with the site base ('/data5pm'), so links work on GitHub Pages
// and keep working if the base later changes to '/'.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function url(path = '/'): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p.endsWith('/') || p.includes('#') || p.includes('.') ? p : `${p}/`}`;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
