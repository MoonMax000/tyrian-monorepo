import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useGetLongShortRatioQuery } from '@/store/api/cryptoApi';
import { MONTHS } from '@/constants';
import { IntraDayPeriod } from '@/types';
import { LongShortRatio } from '@/types/crypto/longShort';

interface LongShortChartProps {
  symbol: string;
  timePeriod: IntraDayPeriod;
}

const LongShortChart = ({ symbol, timePeriod = '5m' }: LongShortChartProps) => {
  const { data } = useGetLongShortRatioQuery({
    symbol: `${symbol}USDT`,
    period: timePeriod,
  });

  const isWithinSameDay = (dataArray: LongShortRatio[]) => {
    if (!dataArray?.length) return false;

    const firstDate = new Date(dataArray[0].timestamp);
    const lastDate = new Date(dataArray[dataArray.length - 1].timestamp);

    return firstDate.toDateString() === lastDate.toDateString();
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);

    if (isWithinSameDay(data || [])) {
      return date.toLocaleTimeString('ru', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    const day = date.getDate();
    const month = MONTHS[date.getMonth()];
    return `${day} ${month}`;
  };

  const chartData =
    data?.map((item) => ({
      date: formatDate(item.timestamp),
      long: parseFloat(item.longAccount) * 100,
      short: -parseFloat(item.shortAccount) * 100,
    })) || [];

  const getTickInterval = (dataLength: number) => {
    if (dataLength <= 10) return 0;
    if (dataLength <= 20) return 1;
    return 2;
  };

  const maxValue = Math.max(
    ...chartData.map((item) => Math.max(Math.abs(item.long), Math.abs(item.short))),
  );
  const roundedMax = Math.ceil(maxValue / 10) * 10;

  return (
    <ResponsiveContainer width='100%' height={237}>
      <BarChart
        data={chartData}
        stackOffset='sign'
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        barGap={-25}
      >
        <defs>
          <linearGradient id='greenGradient' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor='rgba(22, 199, 132, 1)' />
            <stop offset='100%' stopColor='rgba(22, 199, 132, 0)' />
          </linearGradient>
          <linearGradient id='redGradient' x1='0' y1='1' x2='0' y2='0'>
            <stop offset='0%' stopColor='rgba(239, 69, 74, 1)' />
            <stop offset='100%' stopColor='rgba(239, 69, 74, 0)' />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke='#2A2A2A' />
        <XAxis
          dataKey='date'
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#87888b', fontSize: 12, fontWeight: 600 }}
          dy={12}
          interval={getTickInterval(chartData.length)}
        />
        <YAxis
          orientation='left'
          tickFormatter={(value) => `${Math.abs(value)}%`}
          tick={{ fill: '#87888b', fontSize: 12, fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
          domain={[-roundedMax, roundedMax]}
          dx={-22}
        />
        <ReferenceLine y={0} stroke='#2A2A2A' />
        <Bar dataKey='long' fill='url(#greenGradient)' stackId='stack' radius={[4, 4, 0, 0]} />
        <Bar dataKey='short' fill='url(#redGradient)' stackId='stack' radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default LongShortChart;
