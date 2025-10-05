import StatisticsTable from '@/components/Tables/StatisticTable';
import Container from '@/components/UI/Container';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prices',
};

const data = [
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
];

const Volume = () => {
  return (
    <Container className='mb-[120px]'>
      <h3 className='text-h3  mb-8'>{'Prices'}</h3>
      <StatisticsTable data={data} />
    </Container>
  );
};

export default Volume;
