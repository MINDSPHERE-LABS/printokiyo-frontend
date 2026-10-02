import { getBackendBaseSync, isLocal } from '../api/config';

export function getImageUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%2394a3b8">No Image Available</text></svg>';
  }
  
  const backendBase = getBackendBaseSync();
  let clean = url.trim();

  // Fix mixed content blocking on HTTPS mobile browsers by upgrading http to https
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && clean.startsWith('http://') && !clean.includes('localhost') && !clean.includes('127.0.0.1')) {
    clean = clean.replace('http://', 'https://');
  }

  // Replace localhost URLs in production database records
  if (!isLocal && (clean.startsWith('http://localhost:8000') || clean.startsWith('http://127.0.0.1:8000'))) {
    clean = clean.replace(/http:\/\/(localhost|127\.0\.0\.1):8000/, backendBase);
  }

  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:')) {
    return clean;
  }

  // Frontend public static assets (banners, category cards, hero slides)
  if (
    clean.startsWith('/cat-') ||
    clean.startsWith('/hero-') ||
    clean.startsWith('/collage-') ||
    clean.startsWith('/polaroid-') ||
    clean.startsWith('/favicon') ||
    clean.startsWith('/logo')
  ) {
    return clean;
  }
  
  const relativePath = clean.startsWith('/') ? clean : `/${clean}`;
  return `${backendBase}${relativePath}`;
}
