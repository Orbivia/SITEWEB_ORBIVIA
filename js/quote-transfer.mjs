export const QUOTE_KEY = 'orbivia.quote.v1';
const MAX_AGE = 2 * 60 * 60 * 1000;
export function saveQuote(storage, report, now = Date.now()) {
  if (!report || report.length > 16000) throw new Error('Invalid quote');
  storage.setItem(QUOTE_KEY, JSON.stringify({ report, created: now }));
}
export function readQuote(storage, now = Date.now()) {
  try {
    const value = JSON.parse(storage.getItem(QUOTE_KEY));
    if (!value || typeof value.report !== 'string' || !value.report || value.report.length > 16000 || !Number.isFinite(value.created) || now < value.created || now - value.created > MAX_AGE) {
      storage.removeItem(QUOTE_KEY); return '';
    }
    return value.report;
  } catch { return ''; }
}
export function clearQuote(storage) { storage.removeItem(QUOTE_KEY); }
