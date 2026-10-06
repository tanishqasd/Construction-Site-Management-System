export function resolveApiUrl(configuredUrl: string | undefined, production: boolean): string {
  const value = configuredUrl?.trim();
  if (!value) {
    if (production) throw new Error('Set VITE_API_URL to the public Render backend URL before building.');
    return 'http://localhost:5000/api';
  }
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error('VITE_API_URL must be an HTTP(S) URL without credentials, query parameters, or fragments.');
  }
  if (production && (url.protocol !== 'https:' || ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))) {
    throw new Error('Production VITE_API_URL must point to a public HTTPS backend.');
  }
  const path = url.pathname.replace(/\/+$/, '');
  return `${url.origin}${path.endsWith('/api') ? path : `${path}/api`}`;
}
