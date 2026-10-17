/**
 * Utility for Costa Rican Colón (₡) currency formatting.
 */
export function formatCRC(amount: number): string {
  // Format with period as thousands separator standard in Costa Rica
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `₡${formatted}`;
}
