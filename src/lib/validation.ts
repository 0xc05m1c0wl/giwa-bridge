export function isNumeric(input: string): boolean {
  return /^\d*(?:\.\d*)?$/.test(input);
}

export function gtZero(input: string): boolean {
  if (!isNumeric(input)) return false;
  const n = Number(input);

  return Number.isFinite(n) && n > 0;
}
