function isProd(): boolean {

  const meta = import.meta as unknown as { env?: { PROD?: boolean } };

  return Boolean(meta?.env?.PROD);
}

function getToken(): string | undefined {
  const meta = import.meta as unknown as { env?: { VITE_CF_BEACON_TOKEN?: string } };
  const t = meta?.env?.VITE_CF_BEACON_TOKEN || '';

  return t || undefined;
}

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
  if (typeof document === 'undefined') return;
  if (!isProd()) return;
  if (dntEnabled()) return;
  if (hasOptOut()) return;

  const token = getToken();

  if (!token) return;

  if (document.querySelector('script[data-cf-beacon]')) return;

  const s = document.createElement('script');

  s.defer = true;
  s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  s.setAttribute('data-cf-beacon', JSON.stringify({ token }));
  document.head.appendChild(s);
}
