/**
 * Global Formatting Utilities
 */

/**
 * Format an ISO date string or Date object into human-readable date.
 */
export const formatDate = (
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string => {
  const parsedDate = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  if (isNaN(parsedDate.getTime())) {
    return '';
  }
  return new Intl.DateTimeFormat('en-US', options).format(parsedDate);
};

/**
 * Format a number as currency (defaults to USD).
 */
export const formatCurrency = (
  amount: number,
  currency = 'USD',
  locale = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Capitalize the first letter of a string.
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncate text with ellipsis if it exceeds max length.
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};
