import StatisticsTable from '@/components/Tables/StatisticTable';
import Container from '@/components/UI/Container';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'State-Owned Enterprises',
};

const data = [
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
];

const Volume = () => {
  return (
    <Container className='mb-[120px]'>
      <h3 className='text-h3  mb-8'>{'Employment'}</h3>
      <StatisticsTable data={data} />
    </Container>
  );
};

export default Volume;
