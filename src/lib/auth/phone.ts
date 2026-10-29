export function normalizePhone(value: string): string | null {
  if (!/^[\d\s()+-]+$/.test(value)) return null;
  const digits = value.replace(/\D/g, "");
  const local = digits.length === 9 ? digits : digits.startsWith("998") ? digits.slice(3) : "";
  return /^[2-9][0-9]{8}$/.test(local) ? `+998${local}` : null;
}
