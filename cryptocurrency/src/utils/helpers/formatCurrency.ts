export const formatCurrency = (price: number, options?: Intl.NumberFormatOptions): string => {
  const abs = Math.abs(price);
  const defaultDigits = abs < 0.01 ? 6 : 2;

  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
    minimumFractionDigits: defaultDigits,
    maximumFractionDigits: defaultDigits,
    ...options,
  }).format(price);
};
