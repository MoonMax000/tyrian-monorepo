import { SwitchItems } from '@/components/UI/SwitchButtons';

export const filterValues: SwitchItems<string>[] = [
  { value: 'All_coins', label: 'All coins' },
  { value: 'Gainers', label: 'Gainers' },
  { value: 'Losers', label: 'Losers' },
  { value: 'Large-cap', label: 'Large-cap' },
  { value: 'Small-cap', label: 'Small-cap' },
  { value: 'Most traded', label: 'Most traded' },
  { value: 'Lowest volume', label: 'Lowest volume' },
  { value: 'Highest-volume', label: 'Highest volume' },
  { value: 'Most expensive', label: 'Most expensive' },
  { value: 'Most volatile', label: 'Most volatile' },
  { value: 'All-time high', label: 'All-time high' },
  { value: 'All-time low', label: 'All-time low' },
  { value: '52-week high', label: '52-week high' },
];
