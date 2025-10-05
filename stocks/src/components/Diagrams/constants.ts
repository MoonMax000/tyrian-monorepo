import { LegendType } from 'recharts';

export interface IFinanceIndicatorEl {
  date: string;
  operating_profit: number;
  revenue: number;
  left_indicator: number;
  right_indicator: number;
}

export const FINANCE_INDICATORS_MOCK: IFinanceIndicatorEl[] = [
  {
    date: '2019',
    operating_profit: 2010,
    revenue: 2000,
    left_indicator: 2400,
    right_indicator: 2300,
  },
  {
    date: '2020',
    operating_profit: 4000,
    revenue: 3000,
    left_indicator: 1398,
    right_indicator: 1500,
  },
  {
    date: '2021',
    operating_profit: 5000,
    revenue: 2000,
    left_indicator: 9800,
    right_indicator: 9700,
  },
  {
    date: '2022',
    operating_profit: 6000,
    revenue: 2780,
    left_indicator: 3908,
    right_indicator: 3700,
  },
  {
    date: '2023',
    operating_profit: 3000,
    revenue: 1890,
    left_indicator: 4800,
    right_indicator: 3400,
  },
];
export interface IEentry {
  value: string;
  id?: string;
  type?: LegendType;
  color?: string;
  payload?: {
    strokeDasharray: string | number;
    value?: string;
  };
}
export type TLegendkeys = 'left_indicator' | 'revenue' | 'operating_profit';

export const LegendKeys: Record<TLegendkeys, string> = {
  left_indicator: 'Net Profit',
  revenue: 'Revenue',
  operating_profit: 'Operating profit',
};
