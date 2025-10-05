export const formatMoney = (
  value: number,
  currencySymbol = '',
  fixed: number | undefined,
): string => {
  const sign = value < 0 ? '-' : '';
  const absValue = Math.abs(value);
  const toFixed = fixed ? fixed : value % 10 === 0 ? 0 : 2;
  if (absValue >= 1_000) {
    if (absValue > 1_000_000_000_000) {
      return `${currencySymbol}${sign}${Math.round(absValue / 1_000_000_000_000).toFixed(toFixed)}T`;
    }
    if (absValue > 1_000_000_000) {
      return `${currencySymbol}${sign}${Math.round(absValue / 1_000_000_000).toFixed(toFixed)}B`;
    }
    if (absValue > 1_000_000) {
      return `${currencySymbol}${sign}${Math.round(absValue / 1_000_000).toFixed(toFixed)}M`;
    }

    return `${currencySymbol}${sign}${Math.round(absValue / 1_000).toFixed(toFixed)}T`;
  }
  return `${currencySymbol}${value.toFixed(toFixed)}`;
};
