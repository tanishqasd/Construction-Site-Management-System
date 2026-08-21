/** Formats a rupee amount using Indian crore / lakh conventions. */
export function formatCurrency(amount: number): string {
  if (Math.abs(amount) >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (Math.abs(amount) >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString('en-IN');
}

/** 14 Aug */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

/** 14 Aug 2026 */
export function formatFullDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function percent(value: number): string {
  return `${Math.round(value)}%`;
}