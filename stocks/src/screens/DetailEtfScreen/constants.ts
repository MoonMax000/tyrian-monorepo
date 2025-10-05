import apple from '@/assets/mock-stocks.png';
import mockImg from '@/assets/mock-etfs.png';
import nvidia from '@/assets/mock-stocks.png';

export const keyStatsAttributes = [
  {
    title: 'ASSETS UNDER MANAGEMENT (AUM)',
    value: '39.60 BEUR',
  },
  {
    title: 'FUND FLOWS (1Y)',
    value: '-371.72 MEUR',
  },
  {
    title: 'DIVIDEND YIELD (INDICATED)',
    value: '1.02%',
  },
  {
    title: 'DISCOUNT/PREMIUM TO NAV',
    value: '-0.2%',
  },
  {
    title: 'SHARES OUTSTANDING',
    value: '349.47 M',
  },
  {
    title: 'EXPENSE RATIO',
    value: '0.07%',
  },
];

export const aboutAttributes = [
  {
    title: 'ISSUER',
    value: 'UBS AG London Branch',
  },
  {
    title: 'INDEX TRACKED',
    value: 'S&P 500',
  },
  {
    title: 'DIVIDEND TREATMENT',
    value: 'Distributes',
  },
  {
    title: 'PRIMARY ADVISOR',
    value: 'Vanguard Group (Ireland) Ltd.',
  },
  {
    title: 'ISIN',
    value: 'IE00B3XXRP09',
  },
  {
    title: 'BRAND',
    value: 'Vanguard',
  },
  {
    title: 'REPLICATION METHOD',
    value: 'Physical',
  },
  {
    title: 'INCEPTION DATE',
    value: 'May 21, 2012',
  },
  {
    title: 'REPLICATION METHOD',
    value: 'Passive',
  },
];

export const classificationAttributes = [
  {
    title: 'ASSET CLASS',
    value: 'Equity',
  },
  {
    title: 'CATEGORY',
    value: 'Size and style',
  },
  {
    title: 'FOCUS',
    value: 'Large cap',
  },
  {
    title: 'NICHE',
    value: 'Broad-based',
  },
  {
    title: 'STRATEGY',
    value: 'Vanilla',
  },
  {
    title: 'GEOGRAPHY',
    value: 'U.S.',
  },
  {
    title: 'WEIGHTING SCHEME',
    value: 'Market cap',
  },
  {
    title: 'SELECTION CRITERIA',
    value: 'Committee',
  },
];

export const mockHoldings = [
  {
    img: mockImg,
    name: 'Tesla, Inc.',
    shortName: 'TSLA',
    price: 2930.8,
    id: Math.random(),
  },
  {
    img: mockImg,
    name: 'Palantir Technologies Inc.',
    shortName: 'PLTR',
    price: 117.3,
    id: Math.random(),
  },
  {
    img: mockImg,
    name: 'MicroStrategy Inc.',
    shortName: 'MSTR',
    price: 416.03,
    id: Math.random(),
  },
  {
    img: nvidia,
    name: 'NVIDIA Corp',
    shortName: 'NVDA',
    price: 116.65,
    id: Math.random(),
  },
  {
    img: apple,
    name: 'Apple, Inc.',
    shortName: 'AAPL',
    price: 2930.8,
    id: Math.random(),
  },
  {
    img: mockImg,
    name: 'Tesla, Inc.',
    shortName: 'TSLA',
    price: 2930.8,
    id: Math.random(),
  },
  {
    img: mockImg,
    name: 'Palantir Technologies Inc.',
    shortName: 'PLTR',
    price: 117.3,
    id: Math.random(),
  },
  {
    img: mockImg,
    name: 'MicroStrategy Inc.',
    shortName: 'MSTR',
    price: 416.03,
    id: Math.random(),
  },
  {
    img: nvidia,
    name: 'NVIDIA Corp',
    shortName: 'NVDA',
    price: 116.65,
    id: Math.random(),
  },
  {
    img: apple,
    name: 'Apple, Inc.',
    shortName: 'AAPL',
    price: 2930.8,
    id: Math.random(),
  },
];

export const mockStocksList = [
  { id: Math.random(), name: 'Electronic Technology', percent: 20.32 },
  { id: Math.random(), name: 'Technology Services', percent: 20.09 },
  { id: Math.random(), name: 'Finance', percent: 15.57 },
  { id: Math.random(), name: 'Health Technology', percent: 8.61 },
  { id: Math.random(), name: 'Retail Trade', percent: 7.97 },
  { id: Math.random(), name: 'Consumer Non-Durables', percent: 4.2 },
  { id: Math.random(), name: 'Producer Manufacturing', percent: 3.19 },
  { id: Math.random(), name: 'Consumer Services', percent: 3.02 },
  { id: Math.random(), name: 'Utilities', percent: 2.64 },
  { id: Math.random(), name: 'Energy Minerals', percent: 2.48 },
  { id: Math.random(), name: 'Consumer Durables', percent: 2.19 },
  { id: Math.random(), name: 'Transportation', percent: 1.98 },
  { id: Math.random(), name: 'Health Services', percent: 1.82 },
  { id: Math.random(), name: 'Process Industries', percent: 1.56 },
  { id: Math.random(), name: 'Commercial Services', percent: 1.1 },
  { id: Math.random(), name: 'Communications', percent: 1.07 },
  { id: Math.random(), name: 'Industrial Services', percent: 0.96 },
  { id: Math.random(), name: 'Distribution Services', percent: 0.71 },
  { id: Math.random(), name: 'Non-Energy Minerals', percent: 0.48 },
  { id: Math.random(), name: 'Miscellaneous', percent: 0.05 },
];

export const mockLocationList = [
  { id: Math.random(), name: 'North America', percent: 97.41 },
  { id: Math.random(), name: 'Europe', percent: 2.59 },
  { id: Math.random(), name: 'Latin America', percent: 0.0 },
  { id: Math.random(), name: 'Asia', percent: 0.0 },
  { id: Math.random(), name: 'Africa', percent: 0.0 },
  { id: Math.random(), name: 'Middle East', percent: 0.0 },
  { id: Math.random(), name: 'Oceania', percent: 0.0 },
];
