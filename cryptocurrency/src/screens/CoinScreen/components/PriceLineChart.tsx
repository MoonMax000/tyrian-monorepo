import { FC } from 'react';
import {
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
} from 'recharts';
import { useGetLatestHistoricalQuotesQuery } from '@/store/api/cryptoApi';
import { formatCurrency } from '@/utils/helpers/formatCurrency';
import { TimePeriod } from '@/types';
import { formatCurrencyShort } from '@/utils/helpers/formatCurrencyShort';
import { MONTHS } from '@/constants/months';

interface PriceLineChartProps {
  timeStart: string;
  timeEnd: string;
  interval: TimePeriod;
  limit: number;
  slug: string;
  symbol: string;
}

const PriceLineChart: FC<PriceLineChartProps> = ({
  symbol,
  slug,
  timeStart,
  timeEnd,
  interval,
  limit,
}) => {
  const { data, isLoading } = useGetLatestHistoricalQuotesQuery({
    symbol: symbol,
    time_start: timeStart,
    time_end: timeEnd,
    interval,
    limit,
  });

  if (isLoading) return <div>Loading...</div>;

  const bitcoinData = data?.[symbol]?.find((coin) => coin.symbol === symbol);
  if (!bitcoinData) return null;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);

    switch (interval) {
      case '1h':
        return date.toLocaleTimeString('ru', {
          hour: '2-digit',
          minute: '2-digit',
        });
      case '12h':
        return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
      case '24h':
        return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
      case '1d':
        return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
      default:
        return date.toLocaleTimeString('ru', {
          hour: '2-digit',
          minute: '2-digit',
        });
    }
  };

  const chartData = bitcoinData.quotes
    .filter((_, index) => bitcoinData.quotes.length <= 30 || index % 2 === 0)
    .map((item) => ({
      date: formatDate(item.timestamp),
      price: item.quote.USD.price,
    }));

  return (
    <ResponsiveContainer width='100%' height={450}>
      <AreaChart 
    data={chartData}
    margin={{ 
      right: -6,
    }}
  >
        <defs>
          <linearGradient id='priceGradient' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='1%' stopColor='rgba(160, 106, 255, 0.8)' />
            <stop offset='99%' stopColor='rgba(160, 106, 255, 0)' />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke='#2A2A2A' />
        <XAxis
          dataKey='date'
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#87888b', fontSize: 12 }}
          dy={10}
          interval={'preserveStartEnd'}
        />
        <YAxis
          orientation='right'
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#87888b', fontSize: 12 }}
          tickFormatter={(value) => formatCurrencyShort(value)}
          dx={2}
        />
        <Tooltip
          contentStyle={{ background: '#1C1C1E', border: 'none', borderRadius: '8px' }}
          labelStyle={{ color: '#87888b' }}
          formatter={(value: number) => formatCurrency(value)}
        />
        <Area
          type='monotone'
          dataKey='price'
          stroke='#A06AFF'
          strokeWidth={2}
          fill='url(#priceGradient)'
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default PriceLineChart;
