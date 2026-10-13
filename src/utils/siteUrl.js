/**
 * Returns the URL of the live public newspaper website.
 * In local development, pulse-news-admin runs on port 5175 while the public site runs on port 5174.
 * In production, this can be configured via VITE_LIVE_SITE_URL or defaults to root.
 */
export const getLiveSiteUrl = (path = '') => {
  let base = '/';

  // Explicitly configured URL from environment variable
  if (import.meta.env.VITE_LIVE_SITE_URL) {
    base = import.meta.env.VITE_LIVE_SITE_URL;
  } else if (typeof window !== 'undefined') {
    // Local development detection
    const { hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      base = `${window.location.protocol}//${hostname}:5174`;
    }
  }

  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  if (!path) {
    return cleanBase ? `${cleanBase}/` : '/';
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};
