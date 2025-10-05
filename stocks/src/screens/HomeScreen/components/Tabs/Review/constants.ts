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

const calculateYearDateRanges = () => {
  const today = new Date();
  return [
    {
      label: '1Y',
      key: 'year',
      startDate: format(subYears(today, 1), 'yyyy-MM-dd'),
      endDate: format(today, 'yyyy-MM-dd'),
    },
    {
      label: '5Y',
      key: 'five_years',
      startDate: format(subYears(today, 5), 'yyyy-MM-dd'),
      endDate: format(today, 'yyyy-MM-dd'),
    },
    {
      label: 'ALL',
      key: 'max',
      startDate: format(subYears(today, 50), 'yyyy-MM-dd'),
      endDate: format(today, 'yyyy-MM-dd'),
    },
  ];
};

// Используем динамически вычисляемые фильтры
export const yearFilters = calculateDateRanges();
export const yearFiltersArray = calculateYearDateRanges();

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

export const mockRevenueNetData = [
  { name: '2019', revenue: 5550000000000, netIncome: 151000000000 },
  { name: '2020', revenue: 1004000000000, netIncome: 960000000000 },
  { name: '2021', revenue: 1243000000000, netIncome: 191000000000 },
  { name: '2022', revenue: 1541000000000, netIncome: 100000000000 },
  { name: '2023', revenue: 1996000000000, netIncome: 882000000000 },
];

export const mockFundamentalAnalysis = [
  { indicator: 'P\x2FE (LTM)', tooltip: 'Lorem Ipsum', company: 39.34, branch: 21.17 },
  { indicator: 'P\x2FBV (LTM)', tooltip: 'Lorem Ipsum', company: 5.15, branch: 2.22 },
  { indicator: 'EV/EBITDA (LTM)', tooltip: 'Lorem Ipsum', company: 39.34, branch: 21.17 },
  { indicator: 'Net Debt/EBITDA (LTM)', tooltip: 'Lorem Ipsum', company: -0.06, branch: 21.17 },
  { indicator: 'ROE (LTM)', tooltip: 'Lorem Ipsum', company: 39.34, branch: 21.17 },
];

export const fundamentalAnalysisMockData = [
  {
    indicator: 'P/E (LTM)',
    company: 39.34,
    industry: 21.17,
  },
  {
    indicator: 'P/BV (LTM)',
    company: 5.15,
    industry: 2.22,
  },
  {
    indicator: 'EV/EBITDA (LTM)',
    company: 13.47,
    industry: 20.83,
  },
  {
    indicator: 'Net Debt/EBITDA (LTM)',
    company: -0.06,
    industry: 3.34,
  },
  {
    indicator: 'ROE (LTM)',
    company: 8.31,
    industry: 23.5,
  },
];

export const holderColors = ['#A06AFF', '#6AA5FF', '#FF6A79', '#6AFF9C', '#FFB46A'];

export const mockGraphicData = [
  { name: 'GT GlobalTruck Limited', color: '#A06AFF', value: 500 },
  { name: 'Другие акционеры', color: '#6AA6FF', value: 300 },
  { name: 'РФПИ и соинвесторы', color: '#FF6A79', value: 200 },
  { name: '-', color: '#6AFF9C', value: 0 },
  { name: '-', color: '#FFB46A', value: 0 },
];

export const debtAndCoverageMockData = [
  {
    date: '2024-03-31',
    totalAssets: 125000000,
    totalLiabilities: 52000000,
    cashAndCashEquivalents: 18000000,
    reportedCurrency: '$',
  },
  {
    date: '2023-12-31',
    totalAssets: 118000000,
    totalLiabilities: 49000000,
    cashAndCashEquivalents: 15000000,
    reportedCurrency: '$',
  },
  {
    date: '2023-09-30',
    totalAssets: 112500000,
    totalLiabilities: 47000000,
    cashAndCashEquivalents: 12000000,
    reportedCurrency: '$',
  },
  {
    date: '2023-06-30',
    totalAssets: 110000000,
    totalLiabilities: 46000000,
    cashAndCashEquivalents: 10000000,
    reportedCurrency: '$',
  },
  {
    date: '2023-03-31',
    totalAssets: 108000000,
    totalLiabilities: 45000000,
    cashAndCashEquivalents: 9500000,
    reportedCurrency: '$',
  },
];

export const financialAnalysisMockData = {
  totalNonCurrentLiabilities: 28000000,
  totalCurrentLiabilities: 24000000,
  totalNonCurrentAssets: 65000000,
  totalCurrentAssets: 40000000,
};

export const incomeAndRevenueHistoryMockData = [
  {
    date: '2024-03-31',
    revenue: 120000000,
    grossProfit: 75000000,
    netIncome: 25000000,
    reportedCurrency: 'USD',
  },
  {
    date: '2023-12-31',
    revenue: 110000000,
    grossProfit: 68000000,
    netIncome: 22000000,
    reportedCurrency: 'USD',
  },
  {
    date: '2023-09-30',
    revenue: 105000000,
    grossProfit: 64000000,
    netIncome: 20000000,
    reportedCurrency: 'USD',
  },
  {
    date: '2023-06-30',
    revenue: 95000000,
    grossProfit: 60000000,
    netIncome: 18000000,
    reportedCurrency: 'USD',
  },
  {
    date: '2023-03-31',
    revenue: 90000000,
    grossProfit: 58000000,
    netIncome: 15000000,
    reportedCurrency: 'USD',
  },
];

export const debtsAssetsMockData = [
  {
    date: '2023-12-31',
    totalAssets: 1500000,
    totalLiabilities: 800000,
    totalDebt: 600000,
    netDebt: 500000,
    reportedCurrency: 'USD',
  },
  {
    date: '2022-12-31',
    totalAssets: 1400000,
    totalLiabilities: 750000,
    totalDebt: 580000,
    netDebt: 470000,
    reportedCurrency: 'USD',
  },
  {
    date: '2021-12-31',
    totalAssets: 1300000,
    totalLiabilities: 700000,
    totalDebt: 550000,
    netDebt: 440000,
    reportedCurrency: 'USD',
  },
  {
    date: '2020-12-31',
    totalAssets: 1200000,
    totalLiabilities: 680000,
    totalDebt: 530000,
    netDebt: 420000,
    reportedCurrency: 'USD',
  },
  {
    date: '2019-12-31',
    totalAssets: 1100000,
    totalLiabilities: 650000,
    totalDebt: 510000,
    netDebt: 400000,
    reportedCurrency: 'USD',
  },
];

export const shareholdersStructureMock = [
  {
    holder: 'Vanguard Group Inc.',
    shares: 32000000,
    sharesPercent: 8.45,
    change: 1.2,
  },
  {
    holder: 'BlackRock Inc.',
    shares: 29000000,
    sharesPercent: 7.65,
    change: 0.9,
  },
  {
    holder: 'State Street Corporation',
    shares: 25000000,
    sharesPercent: 6.2,
    change: -0.3,
  },
  {
    holder: 'Fidelity Management & Research',
    shares: 21000000,
    sharesPercent: 5.15,
    change: 0.5,
  },
  {
    holder: 'Capital Research Global Investors',
    shares: 18000000,
    sharesPercent: 4.05,
    change: -0.1,
  },
];

export const profitGrowtHistoryMock = {
  date: '2023–2024',
  company: 35,
  industry: -2,
  market: -1,
};
