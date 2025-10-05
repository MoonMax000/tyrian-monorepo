type Params = {
  num: number;
  toFixed?: number;
  symbolAfter?: string;
  symbolBefore?: string;
};

export const formatNumberWithSymbols = ({
  num,
  toFixed = 0,
  symbolAfter = '',
  symbolBefore = '',
}: Params) => {
  return `${symbolBefore}${num.toFixed(toFixed)}${symbolAfter}`;
};
