import iconT from '@/assets/shares/tsc.png';
import iconSBER from '@/assets/shares/sber.png';
import iconPik from '@/assets/shares/pik.png';
import iconSamolet from '@/assets/shares/samolet.png';
import iconMechel from '@/assets/shares/mechel.png';
import iconGAZP from '@/assets/shares/GAZP.png';
import { CointryStatisticsDataItem } from './components/CountryStatictics';
import { IMarketLeadersEl } from '@/services/MainPageService';

export interface StockModel {
  name: string;
  description: string;
  price: number;
  profitability: number;
  icon: string;
}

export const mockStocksProfability: IMarketLeadersEl[] = [
  {
    symbol: 'ARM',
    name: 'Arm Holdings plc American Depositary Shares',
    price: 100.73,
    icon: '/media/company_icons/ARM.png',
    changesPercentage: -0.26733,
  },
  {
    symbol: 'COIN',
    name: 'Coinbase Global, Inc.',
    price: 175.03,

    icon: '/media/company_icons/COIN.png',
    changesPercentage: 1.63754,
  },
  {
    symbol: 'CVNA',
    name: 'Carvana Co.',
    price: 211.41,

    icon: '/media/company_icons/CVNA.png',
    changesPercentage: 1.00812,
  },
  {
    symbol: 'IBIT',
    name: 'iShares Bitcoin Trust',
    price: 48.26,

    icon: '/media/company_icons/IBIT.png',
    changesPercentage: 0.62552,
  },
  {
    symbol: 'MSTR',
    name: 'MicroStrategy Incorporated',
    price: 317.2,

    icon: '/media/company_icons/MSTR.png',
    changesPercentage: 1.77758,
  },
  {
    symbol: 'STRK',
    name: 'MicroStrategy Incorporated',
    price: 85.15,

    icon: '/media/company_icons/STRK.png',
    changesPercentage: 0.25904,
  },
];

export const MockETF: IMarketLeadersEl[] = [
  {
    symbol: 'STSS',
    name: 'Sharps Technology, Inc.',

    changesPercentage: 20.75472,
    icon: '/media/company_icons/STSS.png',
    price: 0.032,
  },
  {
    symbol: 'DMN',
    name: 'Damon Inc. Common Stock',

    changesPercentage: 9.67742,
    icon: '/media/company_icons/DMN.png',
    price: 0.0034,
  },
  {
    symbol: 'SUNE',
    name: 'SUNation Energy Inc.',

    changesPercentage: 2.04082,
    icon: '/media/company_icons/SUNE.png',
    price: 0.02,
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',

    changesPercentage: -2.87109,
    icon: '/media/company_icons/NVDA.png',
    price: 101.49,
  },
  {
    symbol: 'HTZ',
    name: 'Hertz Global Holdings, Inc.',

    changesPercentage: 44.30823,
    icon: '/media/company_icons/HTZ.png',
    price: 8.24,
  },
  {
    symbol: 'SOXL',
    name: 'Direxion Daily Semiconductor Bull 3X Shares',

    changesPercentage: -1.49893,
    icon: '/media/company_icons/SOXL.png',
    price: 9.2,
  },
];

export const mockStocks: StockModel[] = [
  {
    name: 'T',
    description: 'Т-Технологии МКПАО - обыкн.',
    price: 2930.8,
    profitability: 0.14,
    icon: iconT.src,
  },
  {
    name: 'SBER',
    description: 'Сбербанк России ПАО - обыкн',
    price: 276.05,
    profitability: 0.03,
    icon: iconSBER.src,
  },
  {
    name: 'PIKK',
    description: 'ПИК СЗ (ПАО) - обыкн.',
    price: 687.5,
    profitability: -1.75,
    icon: iconPik.src,
  },
  {
    name: 'SMLT',
    description: 'ГК Самолет - обыкн.',
    price: 1274,
    profitability: -1.37,
    icon: iconSamolet.src,
  },
  {
    name: 'GAZP',
    description: '"Газпром" (ПАО) - обыкн.',
    price: 133.78,
    profitability: -0.77,
    icon: iconGAZP.src,
  },
  {
    name: 'MTLR',
    description: 'Мечел ПАО - обыкн.',
    price: 110.54,
    profitability: -1.13,
    icon: iconMechel.src,
  },
];

export const mockCountryStatisticsData: Record<string, CointryStatisticsDataItem[]> = {
  vvp: [
    {
      indicator: 'GDP',
      last_price: '$2.02T',
      period: '2023',
    },
    {
      indicator: 'Real GDP',
      last_price: '$36.92T',
      period: 'Q3 2024',
    },
    {
      indicator: 'Gross National Product (GNP)',
      last_price: '$65.17T',
      period: '2015',
    },
    {
      indicator: 'GDP per capita (by PPP)',
      last_price: '$39.75К',
      period: '2023',
    },
    {
      indicator: 'GDP Growth',
      last_price: '3.1%',
      period: 'Q3 2024',
    },
    {
      indicator: 'GDP Growth Rate',
      last_price: '-0.8%',
      period: 'Q3 2021',
    },
  ],
  countryCompanies: [
    {
      indicator: 'Government Revenue',
      last_price: '$36.71B',
      period: 'Dec 2024 г.',
    },
    {
      indicator: 'Government Expenditure',
      last_price: '$6.72T',
      period: 'Q3 2024',
    },
    {
      indicator: 'State Budget Balance',
      last_price: '$36.71B',
      period: 'Dec 2024 г.',
    },
    {
      indicator: 'National Debt',
      last_price: '$20.59T',
      period: 'Apr 2024 г.',
    },
    {
      indicator: 'National Debt to GDP',
      last_price: '14.9% of GDP',
      period: '2023',
    },
    {
      indicator: 'Military Expenditure',
      last_price: '$109.45B',
      period: '2023',
    },
  ],
  prices: [
    {
      indicator: 'Inflation Rate (MoM)',
      last_price: '1.3%',
      period: 'Dec 2024 г.',
    },
    {
      indicator: 'Inflation Rate (YoY)',
      last_price: '9.5%',
      period: 'Dec 2024 г.',
    },
    {
      indicator: 'Core Inflation (YoY)',
      last_price: '8.93%',
      period: 'Dec 2024 г.',
    },
    {
      indicator: 'Producer Price Index (YoY)',
      last_price: '3.9%',
      period: 'Nov 2024 г.',
    },
    {
      indicator: 'Food Inflation (YoY)',
      last_price: '11.05%',
      period: 'Dec 2024 г.',
    },
    {
      indicator: 'Consumer Price Index',
      last_price: '272.8 pts.',
      period: 'Dec 2024 г.',
    },
  ],

  employmentOfPopulation: [
    {
      indicator: 'Emloyed Population',
      last_price: '74.6М people',
      period: 'Okt 2024 г.',
    },
    {
      indicator: 'Unemployed Population',
      last_price: '1.8М people',
      period: 'Okt 2024 г.',
    },
    {
      indicator: 'Unemployment Rate',
      last_price: '2.3%',
      period: '2025',
    },
    {
      indicator: 'Minimum Wage',
      last_price: '$22.44K/month',
      period: 'Okt 2024 г.',
    },
    {
      indicator: 'Average Wage',
      last_price: '$86.58K/month',
      period: 'Okt 2024 г.',
    },
    {
      indicator: 'Wage Growth (YoY)',
      last_price: '7.2%',
      period: 'Dec. 2024 г.',
    },
  ],
};
