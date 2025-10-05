import StatisticsTable from '@/components/Tables/StatisticTable';
import Container from '@/components/UI/Container';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'State-Owned Enterprises',
};

const data = [
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
];

const Volume = () => {
  return (
    <Container className='mb-[120px]'>
      <h3 className='text-h3  mb-8'>{'State-Owned Enterprises'}</h3>
      <StatisticsTable data={data} />
    </Container>
  );
};

export default Volume;
