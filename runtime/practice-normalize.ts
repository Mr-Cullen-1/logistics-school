// Opt-in for advanced tasks; numbers, dates, IDs, negation and units stay meaningful.
export function normalizeMeaningfulAnswer(value: string) {
  return value.toLowerCase().trim().replace(/[‘’]/g, "'")
    .replace(/\b(\d{1,3}(?:,\d{3})+)\b/g, number => number.replace(/,/g, ''))
    .replace(/[.!?]+$/, '').replace(/(\D),|,(\D)/g, '$1$2')
    .replace(/\s+/g, ' ');
}
