export const formatCurrency = (price: number, options?: Intl.NumberFormatOptions): string => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    currency: 'USD',

    style: 'currency',
    minimumFractionDigits: 0,
    ...options,
  }).format(price);

  const result = formattedPrice.replace(/,/g, '.');

  return result;
};
