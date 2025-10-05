export const countries = [
  {
    flag: '/countries/us.png',
    name: 'USA',
  },
  {
    flag: '/countries/eu.png',
    name: 'European Union',
  },
  {
    flag: '/countries/cn.png',
    name: 'China',
  },
  {
    flag: '/countries/jp.png',
    name: 'Japan',
  },
  {
    flag: '/countries/hk.png',
    name: 'Hong Kong',
  },
  {
    flag: '/countries/in.png',
    name: 'India',
  },
  {
    flag: '/countries/sa.png',
    name: 'Saudi Arabia',
  },
  {
    flag: '/countries/ru.png',
    name: 'Russia',
  },
];

export const periods = ['1D', '1M', '6M', '1Y', '5Y', 'ALL'];

export const tabs = [
  { name: 'Stocks', key: '0' },
  { name: 'Crypto', key: '1' },
  { name: 'ETFs', key: '2' },
  { name: 'Futures', key: '3' },
  { name: 'Forex', key: '4' },
  { name: 'Bonds', key: '5' },
];

export const liveNewsButtons = [
  {
    name: 'Earnings',
    isActive: true,
  },
  {
    name: 'Macro',
    isActive: false,
  },
  {
    name: 'Crypto',
    isActive: false,
  },
  {
    name: 'Stock Market',
    isActive: false,
  },
];

export const tools = [
  '- Track client statistics and analytics',
  '- Use ready-made promotional materials (banners, text copies, images)',
  '- Receive a unique referral link for automatic tracking of your referred clients',
];

export interface StocksValues {
  title: string;
  logo: string;
  desc: string;
  price: string;
  percent: number;
}

export const stocksValues: StocksValues[] = [
  {
    title: 'Tesla, Inc.',
    logo: '/logos/tesla.svg',
    desc: 'TSLA',
    price: '$2,930.80',
    percent: 4.72,
  },
  {
    title: 'Palantir Technologies Inc.',
    logo: '/logos/palantir.svg',
    desc: 'PLTR',
    price: '$117.30',
    percent: -1.55,
  },
  {
    title: 'MicroStrategy Inc.',
    logo: '/logos/ms.svg',
    desc: 'MSTR',
    price: '$416.03',
    percent: -0.61,
  },
  {
    title: 'NVIDIA Corp',
    logo: '/logos/nvidia.svg',
    desc: 'NVDA',
    price: '$116.65',
    percent: 4.72,
  },
  {
    title: 'Apple, Inc.',
    logo: '/logos/apple.svg',
    desc: 'AAPL',
    price: '$2,930.80',
    percent: 0.14,
  },
  {
    title: 'Microsoft Corporation',
    logo: '/logos/microsoft.svg',
    desc: 'MSFT',
    price: '$2,930.80',
    percent: 0.14,
  },
];

export const forexData = [
  {
    title: 'EUR / USD',
    desc: 'EURUSD',
    logo: '/currency-logos/eu.svg',
    price: '1.12302',
    percent: -0.14, // Converted from '-0.14$' to number
  },
  {
    title: 'GBP / USD',
    desc: 'GBPUSD',
    logo: '/currency-logos/gb.svg',
    price: '1.32880',
    percent: -0.08, // Converted from '-0.08%' to number
  },
  {
    title: 'CAD / USD',
    desc: 'CADUSD',
    logo: '/currency-logos/ca.svg',
    price: '1.39236',
    percent: -0.1, // Converted from '-0.10%' to number
  },
  {
    title: 'CHF / USD',
    desc: 'CHFUSD',
    logo: '/currency-logos/ch.svg',
    price: '1.39236',
    percent: -0.1, // Converted from '-0.10%' to number
  },
  {
    title: 'USD / JPY',
    desc: 'USDJPY',
    logo: '/currency-logos/jp.svg',
    price: '145.830',
    percent: 0.35, // Converted from '+0.35%' to number
  },
  {
    title: 'AUD / USD',
    desc: 'AUDUSD',
    logo: '/currency-logos/au.svg',
    price: '0.64332',
    percent: 0.35, // Converted from '+0.35%$' to number
  },
  {
    title: 'RUB / USD',
    desc: 'RUBUSD',
    logo: '/currency-logos/ru.svg',
    price: '0.83388',
    percent: 0.36, // Converted from '+0.36%' to number
  },
  {
    title: 'KZT / USD',
    desc: 'KZTUSD',
    logo: '/currency-logos/kz.svg',
    price: '0.83388',
    percent: 0.36, // Converted from '+0.36%' to number
  },
];
