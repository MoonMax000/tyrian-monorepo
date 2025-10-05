import { FC } from 'react';
import {
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Bar,
  Cell,
  ComposedChart,
} from 'recharts';
import { TimeRange } from './types';
import CustomTooltip from './CustomTooltip';
import { CHART_COLORS } from './chartColors';
import { formatXAxis, formatYAxis } from '@/utils/helpers/formatXY';
import { limitXTicks } from './limitXTicks';

export interface ICurrencyDataQuote {
  total_market_cap: number;
  total_volume_24h: number;
  date: string;
  time: string;
  bar_color?: string;
}

interface AreaBarChartProps {
  data: ICurrencyDataQuote[];
  className?: string;
  selectedTimeRange: TimeRange;
}

const MainAreaBarChart: FC<AreaBarChartProps> = ({ data, className, selectedTimeRange }) => {
  const minMarketCap = Math.min(...data.map((d) => d.total_market_cap));
  const maxMarketCap = Math.max(...data.map((d) => d.total_market_cap));
  const filteredData = limitXTicks(data, 6, 'date');

  const getMarkerPosition = (value: number) => {
    const yAxisMax = maxMarketCap * 1.1;
    return `${(value / yAxisMax) * 100}%`;
  };

  return (
    <div className='bg-transparent h-full flex flex-col relative'>
      <ResponsiveContainer width='100%' height='100%'>
        <ComposedChart data={data} margin={{ top: 15 }}>
          <defs>
            <linearGradient id='colorMarketCap' x1='0' y1='0' x2='0' y2='1'>
              <stop
                offset='1%'
                stopColor={CHART_COLORS.areaGradientStartPurple}
                stopOpacity={0.8}
              />
              <stop offset='75%' stopColor={CHART_COLORS.areaGradientEnd} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis
            yAxisId='right'
            orientation='right'
            tick={{ fill: CHART_COLORS.labelGray, dx: 50, textAnchor: 'end' }}
            strokeWidth={0}
            tickFormatter={formatYAxis}
            domain={[0, 'auto']}
          />
          <XAxis
            dataKey='date'
            tick={{ fill: CHART_COLORS.labelGray, dy: 10 }}
            tickFormatter={(tick) => formatXAxis(tick, selectedTimeRange)}
            ticks={filteredData.map((d) => d.date)}
          />
          <Tooltip content={<CustomTooltip labelMapping={{ total_market_cap: "MARKET CAP", total_volume_24h: "VOLUME (24H)" }} />} />
          <CartesianGrid vertical={false} stroke={CHART_COLORS.gridLine} />
          <Area
            yAxisId='right'
            dataKey='total_market_cap'
            stroke={CHART_COLORS.areaGradientStartPurple}
            fillOpacity={1}
            fill='url(#colorMarketCap)'
          />
          <Bar dataKey='total_volume_24h' yAxisId='right' radius={[5, 5, 0, 0]} barSize={4}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.bar_color} />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
      <div
        className='absolute right-5 text-sm px-2 py-1 rounded cursor-default'
        style={{
          bottom: getMarkerPosition(maxMarketCap),
          backgroundColor: "rgba(28, 52, 48, 1)",
          color: CHART_COLORS.barPositive
        }}
      >
        {`${(maxMarketCap / 1e12).toFixed(2)}T`}
      </div>
      <div
        className='absolute right-5 text-sm px-2 py-1 rounded cursor-default'
        style={{
          bottom: getMarkerPosition(minMarketCap),
          backgroundColor: "rgba(58, 33, 39, 1)",
          color: CHART_COLORS.barNegative
        }}
      >
        {`${(minMarketCap / 1e12).toFixed(2)}T`}
      </div>
    </div>
  );
};


export default MainAreaBarChart;
