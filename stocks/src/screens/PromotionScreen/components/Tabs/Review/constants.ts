import { PeperDetailsResponse } from '@/services/StocksService';
import { subYears, subMonths, format } from 'date-fns';

export interface IFundamentalAnalityc {
  indicator: string;
  value: string;
  label: keyof PeperDetailsResponse;
}

// Функция для формирования диапазонов
const calculateDateRanges = () => {
  const today = new Date();
  return [
    {
      label: '1М',
      key: 'month',
      startDate: format(subMonths(today, 1), 'yyyy-MM-dd'),
      endDate: format(today, 'yyyy-MM-dd'),
    },
    {
      label: '6М',
      key: 'six_months',
      startDate: format(subMonths(today, 6), 'yyyy-MM-dd'),
      endDate: format(today, 'yyyy-MM-dd'),
    },
    {
      label: '1Г',
      key: 'year',
      startDate: format(subYears(today, 1), 'yyyy-MM-dd'),
      endDate: format(today, 'yyyy-MM-dd'),
    },
    {
      label: '5Л',
      key: 'five_years',
      startDate: format(subYears(today, 5), 'yyyy-MM-dd'),
      endDate: format(today, 'yyyy-MM-dd'),
    },
    {
      label: 'Макс.',
      key: 'max',
      startDate: format(subYears(today, 50), 'yyyy-MM-dd'),
      endDate: format(today, 'yyyy-MM-dd'),
    },
  ];
};

// Используем динамически вычисляемые фильтры
export const yearFilters = calculateDateRanges();

export const mockProfitabilityItems = [
  {
    market_title: 'Рынок акций',
    trade_date: '2025-01-16',
    trades_number: 1254,
    value: 24796786,
    volume: 270520,
    updated_at: '2025-01-16 12:15:46',
  },
  {
    market_title: 'Режим переговорных сделок',
    trade_date: '2025-01-16',
    trades_number: 0,
    value: 0,
    volume: 0,
    updated_at: '2025-01-16 12:15:46',
  },
  {
    market_title: 'Рынок сделок РЕПО',
    trade_date: '2025-01-16',
    trades_number: 287,
    value: 30898634,
    volume: 325742,
    updated_at: '2025-01-16 12:15:46',
  },
  {
    market_title: 'Мультивалютный рынок смешанных активов',
    trade_date: '2025-01-16',
    trades_number: 0,
    value: 0,
    volume: 0,
    updated_at: '2025-01-16 12:15:46',
  },
  {
    market_title: 'Режим переговорных сделок (нерезиденты)',
    trade_date: '2025-01-16',
    trades_number: 0,
    value: 0,
    volume: 0,
    updated_at: '2025-01-16 12:15:46',
  },
  {
    market_title: 'Рынок РЕПО (нерезиденты)',
    trade_date: '2025-01-16',
    trades_number: 0,
    value: 0,
    volume: 0,
    updated_at: '2025-01-16 12:15:46',
  },
];

export const mockProfitabilityData = [
  { label: 'За 5 дн.', value: '1.5%' },
  { label: 'За 1 мес.', value: '3.2%' },
  { label: 'За 3 мес.', value: '7.8%' },
  { label: 'За 6 мес.', value: '12.5%' },
  { label: 'За 1 год', value: '20%' },
  { label: 'За 3 года', value: '45%' },
  { label: 'За 5 лет', value: '75%' },
  { label: 'С момента выхода на рынок', value: '150%' },
];

export const mockSecurityData: IFundamentalAnalityc[] = [
  { indicator: 'Режим торгов', value: '', label: 'trading_regime' },
  { indicator: 'Полное наименование', value: '', label: 'full_name' },
  { indicator: 'Номер гос. регистрации', value: '', label: 'reg_number' },
  { indicator: 'Объем выпуска', value: '', label: 'issue_size' },
  { indicator: 'Валюта номинала', value: '', label: 'currency_id' },
  { indicator: 'Дата начала торгов', value: '', label: 'prev_date' },
  { indicator: 'Группа инструментов', value: '', label: 'instrument_id' },
  {
    indicator: 'Дата расчетов сделки',
    value: '',
    label: 'settlement_date',
  },
];

export const mockFundamentalAnalysis = [
  { indicator: 'P\x2FE (LTM)', tooltip: 'Lorem Ipsum', company: 39.34, branch: 21.17 },
  { indicator: 'P\x2FBV (LTM)', tooltip: 'Lorem Ipsum', company: 5.15, branch: 2.22 },
  { indicator: 'EV/EBITDA (LTM)', tooltip: 'Lorem Ipsum', company: 39.34, branch: 21.17 },
  { indicator: 'Net Debt/EBITDA (LTM)', tooltip: 'Lorem Ipsum', company: -0.06, branch: 21.17 },
  { indicator: 'ROE (LTM)', tooltip: 'Lorem Ipsum', company: 39.34, branch: 21.17 },
];

export const mockGraphicData = [
  { name: 'GT GlobalTruck Limited', color: '#A06AFF', value: 500 },
  { name: 'Другие акционеры', color: '#6AA6FF', value: 300 },
  { name: 'РФПИ и соинвесторы', color: '#FF6A79', value: 200 },
  { name: '-', color: '#6AFF9C', value: 0 },
  { name: '-', color: '#FFB46A', value: 0 },
];
