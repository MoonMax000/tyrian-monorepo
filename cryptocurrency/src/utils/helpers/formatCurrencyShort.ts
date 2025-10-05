export const formatCurrencyShort = (
  num: number,
  symbol: string = '$',
  symbolAfter: boolean = false
): string => {
  if (num === 0) {
    return symbolAfter ? `0 ${symbol}` : `${symbol}0`;
  }

  const abs = Math.abs(num);

  const format = (value: number, suffix: string, digits: number) => {
    const formatted = value.toFixed(digits);
    return symbolAfter
      ? `${formatted}${suffix} ${symbol}`
      : `${symbol}${formatted}${suffix}`;
  };

  if (abs >= 1_000_000_000) {
    return format(num / 1_000_000_000, 'B', abs >= 10_000_000_000 ? 1 : 2);
  }

  if (abs >= 1_000_000) {
    return format(num / 1_000_000, 'M', abs >= 10_000_000 ? 1 : 2);
  }

  if (abs >= 1_000) {
    return format(num / 1_000, 'K', abs >= 100_000 ? 0 : 2);
  }

  if (abs < 0.01) {
    const value = num.toFixed(8);
    return symbolAfter ? `${value} ${symbol}` : `${symbol}${value}`;
  }

  const value = num.toFixed(2);
  return symbolAfter ? `${value} ${symbol}` : `${symbol}${value}`;
};
