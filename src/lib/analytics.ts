function dntEnabled(): boolean {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as unknown as {
    doNotTrack?: string | null;
    msDoNotTrack?: string | null;
  };
  const win = (typeof window !== 'undefined' ? window : {}) as { doNotTrack?: string | null };
  const dnt = nav.doNotTrack ?? win.doNotTrack ?? nav.msDoNotTrack;

  return dnt === '1' || dnt === 'yes';
}

function hasOptOut(): boolean {
  const href = typeof window !== 'undefined' ? window.location?.href : '';

  if (href) {
    try {
      const u = new URL(href);

      if (u.searchParams.get('no-analytics') === '1') {
        try {
          localStorage.setItem('no_analytics', '1');
        } catch {}

        return true;
      }
    } catch {}
  }

  try {
    return typeof localStorage !== 'undefined' && localStorage.getItem('no_analytics') === '1';
  } catch {
    return false;
  }
}

export function initAnalytics(): void {
  const debug = isDebug();

  if (typeof document === 'undefined') {
    if (debug) console.warn('[analytics] skip: no document');

    return;
  }

  if (!import.meta.env.PROD) {
    if (debug) console.warn('[analytics] skip: not production');

    return;
  }

  if (dntEnabled()) {
    if (debug) console.warn('[analytics] skip: DNT enabled');

    return;
  }

  if (hasOptOut()) {
    if (debug) console.warn('[analytics] skip: user opt-out');

    return;
  }

  const token = import.meta.env.VITE_CF_BEACON_TOKEN as string | undefined;

  if (!token) {
    if (debug) console.warn('[analytics] skip: missing token');

    return;
  }

  if (document.querySelector('script[data-cf-beacon]')) {
    if (debug) console.warn('[analytics] skip: script already present');

    return;
  }

  const s = document.createElement('script');

  s.defer = true;
  s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  s.setAttribute('data-cf-beacon', JSON.stringify({ token }));
  document.head.appendChild(s);
  if (debug) console.warn('[analytics] loaded Cloudflare beacon');
}

function isDebug(): boolean {
  const href = typeof window !== 'undefined' ? window.location?.href : '';

  if (href) {
    try {
      const u = new URL(href);

      if (u.searchParams.get('analytics-debug') === '1') {
        try {
          localStorage.setItem('analytics_debug', '1');
        } catch {}

        return true;
      }
    } catch {}
  }

  try {
    return typeof localStorage !== 'undefined' && localStorage.getItem('analytics_debug') === '1';
  } catch {
    return false;
  }
}
