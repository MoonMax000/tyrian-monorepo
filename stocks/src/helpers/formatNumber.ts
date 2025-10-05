export const formatNumber = (num: number | string, symbol?: string): string => {
  const numStr = typeof num === 'string' ? num.replace(/[\s,]/g, '') : num.toString();

  const [integerPart, decimalPart] = numStr.split('.');

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const result = decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;

  return symbol ? `${result}${symbol}` : result;
};
