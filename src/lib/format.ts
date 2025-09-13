export function shortHash(h: string, lead = 10, tail = 6): string {
  if (!h) return '';
  if (h.length <= lead + tail + 1) return h;

  return `${h.slice(0, lead)}…${h.slice(-tail)}`;
}
