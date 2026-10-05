/**
 * PrintOkiyo — Centralized Backend URL Configuration
 * 
 * Direct connection to Render backend in production,
 * and localhost in development.
 */

const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const isLocal = hostname === 'localhost' || 
                hostname === '127.0.0.1' || 
                /^192\.168\./.test(hostname) || 
                /^10\./.test(hostname) || 
                /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname) ||
                hostname.endsWith('.local');

// Backend base URL (local vs production)
const PRODUCTION_BACKEND = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) 
  ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
  : 'https://printokiyo-backend.onrender.com';

const LOCAL_BACKEND = `http://${hostname}:8000`;

const _resolvedBackend: string = isLocal ? LOCAL_BACKEND : PRODUCTION_BACKEND;

/**
 * Returns the resolved backend base URL (without /api).
 */
export async function getBackendBase(): Promise<string> {
  return _resolvedBackend;
}

/**
 * Returns the resolved API base URL (with /api suffix).
 */
export async function getApiBase(): Promise<string> {
  return `${_resolvedBackend}/api`;
}

/**
 * Synchronous getter — returns the resolved backend base.
 */
export function getBackendBaseSync(): string {
  return _resolvedBackend;
}

/**
 * Synchronous getter — returns the resolved API base URL.
 */
export function getApiBaseSync(): string {
  return `${_resolvedBackend}/api`;
}

// Re-export for convenience
export { isLocal, hostname };
