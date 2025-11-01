export function isE164(phone: string): boolean {
  return /^\+[1-9]\d{7,14}$/.test((phone || '').trim());
}

// DPI formato Guatemala: ####-#####-####
export function isDpiGT(dpi: string): boolean {
  const s = (dpi || '').trim();
  if (/^\d{4}-\d{5}-\d{4}$/.test(s)) return true;
  const only = s.replace(/\D/g, '');
  return /^\d{13}$/.test(only);
}

export function toDashedDpi(dpi: string): string {
  const d = (dpi || '').replace(/\D/g, '').slice(0, 13);
  const a = d.slice(0, 4), b = d.slice(4, 9), c = d.slice(9, 13);
  return [a, b, c].filter(Boolean).join('-');
}
