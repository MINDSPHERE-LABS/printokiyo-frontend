/**
 * MakeWithMojo — Centralized Backend URL Configuration
 * 
 * Dual-backend failover system:
 *   PRIMARY  → Cloudflare Tunnel (Termux mobile server)
 *   FALLBACK → Render.com (cloud hosting)
 * 
 * On app load, a silent health check picks the fastest reachable backend.
 * All API files import from here instead of hardcoding URLs.
 */

const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const isLocal = hostname === 'localhost' || 
                hostname === '127.0.0.1' || 
                /^192\.168\./.test(hostname) || 
                /^10\./.test(hostname) || 
                /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname) ||
                hostname.endsWith('.local');

// --- Backend URLs ---
const PRIMARY_BACKEND = 'https://api.makewithmojo.com';
const FALLBACK_BACKEND = 'https://makewithmojo-backend.onrender.com';
const LOCAL_BACKEND = `http://${hostname}:8000`;

// Resolved backend base (without /api) — updated after health check
let _resolvedBackend: string = isLocal ? LOCAL_BACKEND : PRIMARY_BACKEND;
let _healthCheckDone = false;
let _healthCheckPromise: Promise<void> | null = null;

/**
 * Silently pings /health on the primary backend.
 * If it fails or takes too long (3s), switches to the fallback.
 * Runs only once and caches the result.
 */
async function runHealthCheck(): Promise<void> {
  if (isLocal || _healthCheckDone) return;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${PRIMARY_BACKEND}/health`, {
      method: 'HEAD',
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      _resolvedBackend = PRIMARY_BACKEND;
      console.log('[MakeWithMojo] Using primary backend:', PRIMARY_BACKEND);
    } else {
      throw new Error(`Health check returned ${res.status}`);
    }
  } catch {
    _resolvedBackend = FALLBACK_BACKEND;
    console.log('[MakeWithMojo] Primary backend unreachable, using fallback:', FALLBACK_BACKEND);
  } finally {
    _healthCheckDone = true;
  }
}

// Start health check immediately on module load (non-blocking)
if (!isLocal) {
  _healthCheckPromise = runHealthCheck();
}

/**
 * Returns the resolved backend base URL (without /api).
 * If the health check hasn't finished yet, waits for it (max 3s).
 */
export async function getBackendBase(): Promise<string> {
  if (_healthCheckPromise) {
    await _healthCheckPromise;
  }
  return _resolvedBackend;
}

/**
 * Returns the resolved API base URL (with /api suffix).
 * If the health check hasn't finished yet, waits for it (max 3s).
 */
export async function getApiBase(): Promise<string> {
  const base = await getBackendBase();
  return `${base}/api`;
}

/**
 * Synchronous getter — returns the current best-known backend base.
 * Use this when you can't await (e.g., top-level axios config).
 * After the first ~3 seconds of app load, this is always accurate.
 */
export function getBackendBaseSync(): string {
  return _resolvedBackend;
}

/**
 * Synchronous getter — returns the current best-known API base URL.
 */
export function getApiBaseSync(): string {
  return `${_resolvedBackend}/api`;
}

// Re-export for convenience
export { isLocal, hostname };
