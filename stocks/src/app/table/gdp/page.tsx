import StatisticsTable from '@/components/Tables/StatisticTable';
import Container from '@/components/UI/Container';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Futures & Commodities',
};

const data = [
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
];

const Volume = () => {
  return (
    <Container className='mb-[120px]'>
      <h3 className='text-h3  mb-8'>{'GPD'}</h3>
      <StatisticsTable data={data} />
    </Container>
  );
};

export default Volume;
