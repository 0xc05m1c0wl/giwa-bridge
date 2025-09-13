export function sanitizeAmount(input: string, decimals = 18): string {
  let s = input.replace(/[^0-9.]/g, '');
  const firstDot = s.indexOf('.');

  if (firstDot !== -1) {
    s = s.slice(0, firstDot + 1) + s.slice(firstDot + 1).replace(/\./g, '');
  }

  if (firstDot !== -1) {
    const [ints, fracs = ''] = s.split('.');

    s = ints + '.' + fracs.slice(0, decimals);
  }

  if (s.startsWith('.')) s = '0' + s;
  const [ints2, fracs2] = s.split('.');
  const trimmedInts = ints2.replace(/^0+(\d)/, '$1') || '0';

  return fracs2 !== undefined ? `${trimmedInts}.${fracs2}` : trimmedInts;
}
