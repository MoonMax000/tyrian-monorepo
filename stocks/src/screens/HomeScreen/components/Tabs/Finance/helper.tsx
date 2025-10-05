import { IFinanceReportingTableElement } from './constants';

export const numberFormater = (value: number): string => {
  if (value >= 1000) {
    if (value > 100000000) {
      return `${Math.round(value / 10000000).toFixed(2)}B`;
    }
    if (value > 1000000) {
      return `${Math.round(value / 10000).toFixed(2)}М`;
    }
    return `${Math.round(value / 1000).toFixed(2)}K`;
  }
  return value.toString();
};

export const transformObjectToArray = (
  obj: IFinanceReportingTableElement,
): { name: string; pv: number }[] =>
  Object.entries(obj)
    .filter(([key]) => key !== 'name')
    .map(([key, value]) => ({ name: key, pv: value }));
