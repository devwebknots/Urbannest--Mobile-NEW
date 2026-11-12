/**
 * Input helpers shared by the rental application steps.
 */

/** "30112026" or "30/11/2026" -> "30/11/2026" while typing */
export const formatDateInput = (text: string) => {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

/** DD/MM/YYYY -> Date, or null when it isn't a real calendar date */
export const parseDate = (value: string): Date | null => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!m) {
    return null;
  }
  const [day, month, year] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const d = new Date(year, month - 1, day);
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day
    ? d
    : null;
};

/** Real calendar date in DD/MM/YYYY */
export const isValidDate = (value: string) => parseDate(value) !== null;

/** "185000" -> "185,000" while typing (whole dollars) */
export const formatMoneyInput = (text: string) =>
  text
    .replace(/\D/g, '')
    .slice(0, 9)
    .replace(/^0+(?=\d)/, '')
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/** "185,000" -> 185000 */
export const moneyValue = (text: string) => Number(text.replace(/\D/g, '')) || 0;

/** "30/11/2026" -> "Nov 2026" */
export const monthYear = (value: string) => {
  const d = parseDate(value);
  return d
    ? `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()]} ${d.getFullYear()}`
    : value;
};
