import { getApiBaseSync } from '../api/config';

/**
 * Real-Time Active Visitor Tracking
 * 
 * Sends a lightweight heartbeat every 20 seconds while the customer is browsing.
 * Pauses on tab minimize/switch to prevent ghost counts.
 * Sends an exit beacon when the customer leaves or closes the tab.
 */

export function initVisitorTracker(): () => void {
  if (typeof window === 'undefined') return () => {};

  // Retrieve or generate unique session visitor ID
  let visitorId = sessionStorage.getItem('printokiyo_vid');
  if (!visitorId) {
    visitorId = 'v_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    try {
      sessionStorage.setItem('printokiyo_vid', visitorId);
    } catch {}
  }

  const sendHeartbeat = () => {
    // Only send if tab is active/visible
    if (document.visibilityState !== 'visible') return;

    try {
      const apiBase = getApiBaseSync();
      fetch(`${apiBase}/analytics/heartbeat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitor_id: visitorId,
          page: window.location.pathname || '/',
          title: document.title || 'PrintOkiyo'
        }),
        keepalive: true
      }).catch(() => {
        // Silently ignore network interruptions
      });
    } catch {}
  };

  const sendLeave = () => {
    try {
      const apiBase = getApiBaseSync();
      const payload = JSON.stringify({ visitor_id: visitorId });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(`${apiBase}/analytics/leave`, new Blob([payload], { type: 'application/json' }));
      } else {
        fetch(`${apiBase}/analytics/leave`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true
        }).catch(() => {});
      }
    } catch {}
  };

  // 1. Send immediate heartbeat on mount
  sendHeartbeat();

  // 2. Periodic heartbeat every 20s
  const intervalId = setInterval(sendHeartbeat, 20000);

  // 3. Heartbeat when user returns to tab
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      sendHeartbeat();
    }
  };
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // 4. Heartbeat on route / popstate changes
  window.addEventListener('popstate', sendHeartbeat);

  // 5. Notify exit when closing / navigating away
  window.addEventListener('pagehide', sendLeave);
  window.addEventListener('beforeunload', sendLeave);

  return () => {
    clearInterval(intervalId);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('popstate', sendHeartbeat);
    window.removeEventListener('pagehide', sendLeave);
    window.removeEventListener('beforeunload', sendLeave);
  };
}
