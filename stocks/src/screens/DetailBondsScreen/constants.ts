import { SwitchItems } from '@/components/UI/SwitchButtons';

export const keyTermsAttributes = [
  {
    title: 'Outstanding amount',
    value: '350.00 USD',
  },
  {
    title: 'Coupon frequency',
    value: 'Semi-annual',
  },
  {
    title: 'Face value',
    value: '1,000.00 USD',
  },
  {
    title: 'Yield to maturity',
    value: '7.47%',
  },
  {
    title: 'Minimum denomination',
    value: '1,000.00 USDt',
  },
  {
    title: 'Maturity date',
    value: 'Mar 15, 2048',
  },
  {
    title: 'Coupon',
    value: '4.20% (Fixed)',
  },
  {
    title: 'Term to maturity',
    value: '22 years',
  },
];

export const aboutAttributes = [
  {
    title: 'ISSUER',
    value: 'Crane NXT Co.',
  },
  {
    title: 'Sector',
    value: 'Producer Manufacturing',
  },
  {
    title: 'Industry',
    value: 'Industrial Machinery',
  },
  {
    title: 'Home page',
    value: 'cranenxt.com',
  },
  {
    title: 'Issue date',
    value: 'Feb 5, 2018',
  },
  {
    title: 'FIGI',
    value: 'BBG00JYFZ482',
  },
];

export const filterValues: SwitchItems<string>[] = [
  {
    label: 'All Bonds',
    value: 'All Bonds',
  },
  {
    label: 'Short-term',
    value: 'short-term',
  },
  {
    label: 'Long-term',
    value: 'long-term',
  },
  {
    label: 'Floating-rate',
    value: 'floating rate',
  },
  {
    label: 'Fixed-rate',
    value: 'fixed rate',
  },
  {
    label: 'Zero-coupon',
    value: 'zero coupon',
  },
];

export const govtFilterValues: SwitchItems<string>[] = [
  {
    label: 'All Bonds',
    value: 'All Bonds',
  },
  {
    label: 'All 10Y',
    value: 'All 10Y',
  },
  {
    label: 'Major 10Y',
    value: 'Major 10Y',
  },
  {
    label: 'Americas',
    value: 'Americas',
  },
  {
    label: 'Europe',
    value: 'Europe',
  },
  {
    label: 'Asia',
    value: 'Asia',
  },
  {
    label: 'Pacific',
    value: 'Pacific',
  },
  {
    label: 'Middle East',
    value: 'Middle East',
  },
  {
    label: 'Africa',
    value: 'Africa',
  },
  {
    label: 'USA',
    value: 'USA',
  },
  {
    label: 'United Kingdom',
    value: 'United Kingdom',
  },
  {
    label: 'European union',
    value: 'European Union',
  },
  {
    label: 'Germany',
    value: 'Germany',
  },
  {
    label: 'France',
    value: 'France',
  },
  {
    label: 'Mainland China',
    value: 'Mainland China',
  },
  {
    label: 'India',
    value: 'India',
  },
  {
    label: 'Japan',
    value: 'Japan',
  },
];

export const bondsTypeValues: SwitchItems<string>[] = [
  {
    label: 'Corporate',
    value: 'corp',
  },
  {
    label: 'Government',
    value: 'govt',
  },
];

export const keyTermsAttributesGovt = [
  {
    title: 'Coupon',
    value: '0 %',
  },
  {
    title: 'Maturity date',
    value: 'Jul 1, 2025',
  },
  {
    title: 'Term to maturity',
    value: '26 days',
  },
];

export interface CashFlowData {
  date: string;
  netCashProvidedByOperatingActivities: number;
  netCashUsedForInvestingActivites: number;
  netCashUsedProvidedByFinancingActivities: number;
  reportedCurrency: string;
}

export const cashFlowData: Record<string, CashFlowData[]> = {
  data: [
    {
      date: '2023-12-31',
      netCashProvidedByOperatingActivities: 1250000000,
      netCashUsedForInvestingActivites: -450000000,
      netCashUsedProvidedByFinancingActivities: -300000000,
      reportedCurrency: 'USD',
    },
    {
      date: '2022-12-31',
      netCashProvidedByOperatingActivities: 980000000,
      netCashUsedForInvestingActivites: -320000000,
      netCashUsedProvidedByFinancingActivities: -250000000,
      reportedCurrency: 'USD',
    },
    {
      date: '2021-12-31',
      netCashProvidedByOperatingActivities: 750000000,
      netCashUsedForInvestingActivites: -280000000,
      netCashUsedProvidedByFinancingActivities: -180000000,
      reportedCurrency: 'USD',
    },
    {
      date: '2020-12-31',
      netCashProvidedByOperatingActivities: 520000000,
      netCashUsedForInvestingActivites: -150000000,
      netCashUsedProvidedByFinancingActivities: -120000000,
      reportedCurrency: 'USD',
    },
    {
      date: '2019-12-31',
      netCashProvidedByOperatingActivities: 480000000,
      netCashUsedForInvestingActivites: -110000000,
      netCashUsedProvidedByFinancingActivities: -90000000,
      reportedCurrency: 'USD',
    },
  ],
};
