/**
 * Landlord number formatting (Indian grouping, no Intl dependency).
 */

/** 430000 -> "₹4,30,000" */
export function formatInr(amount: number): string {
  const digits = String(Math.round(Math.abs(amount)));
  const last3 = digits.slice(-3);
  const rest = digits.slice(0, -3);
  const grouped = rest ? `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')},${last3}` : last3;
  return `${amount < 0 ? '-' : ''}₹${grouped}`;
}

/** 430000 -> "₹4.30L", 150000 -> "₹1.5L" with digits = 1 */
export function formatLakh(amount: number, digits = 2): string {
  return `₹${(amount / 100000).toFixed(digits)}L`;
}

/** 4.8 -> "+4.8%", -2 -> "-2%" */
export function formatTrend(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return `${rounded >= 0 ? '+' : ''}${rounded}%`;
}

/** Share as a whole percent: (25, 28) -> 89 */
export function percent(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

/** "Good Morning" / "Good Afternoon" / "Good Evening" for the local time */
export function greetingFor(date: Date): string {
  const hour = date.getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}
