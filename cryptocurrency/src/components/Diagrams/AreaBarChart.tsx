import { FC } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { TimeRange } from './types';
import CustomTooltip from './CustomTooltip';
import { CHART_COLORS } from './chartColors';
import { formatXAxis, formatYAxis } from '@/utils/helpers/formatXY';
import { limitXTicks } from './limitXTicks';
import { ICurrencyDataQuote } from './MainAreaBarChart';

interface AreaBarChartProps {
  data: ICurrencyDataQuote[];
  className?: string;
  selectedTimeRange: TimeRange;
}

const AreaBarChart: FC<AreaBarChartProps> = ({ data, className, selectedTimeRange }) => {
  const filteredData = limitXTicks(data, 6, 'date');

  return (
    <div className='bg-transparent h-full flex flex-col'>
      <ResponsiveContainer width='100%' height='80%'>
        <AreaChart data={data} margin={{ top: 24 }}>
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
          <XAxis tick={false} />
          <Tooltip content={<CustomTooltip labelMapping={{ total_market_cap: "MARKET CAP" }} />} />
          <CartesianGrid vertical={false} stroke={CHART_COLORS.gridLine} />
          <Area
            yAxisId='right'
            dataKey='total_market_cap'
            stroke={CHART_COLORS.areaGradientStartPurple}
            fillOpacity={1}
            fill='url(#colorMarketCap)'
          />
        </AreaChart>
      </ResponsiveContainer>

      <ResponsiveContainer width='100%' height='20%'>
        <BarChart data={data}>
          <XAxis
            dataKey='date'
            tick={{ fill: CHART_COLORS.labelGray, dy: 10 }}
            ticks={filteredData.map((d) => d.date)}
            tickFormatter={(tick) => formatXAxis(tick, selectedTimeRange)}
          />
          <YAxis yAxisId='right' orientation='right' strokeWidth={0} tick={false} />
          <Tooltip content={<CustomTooltip labelMapping={{ total_volume_24h: "VOLUME (24H)" }} />} />
          <Bar
            dataKey='total_volume_24h'
            fill={CHART_COLORS.barPositive}
            yAxisId='right'
            radius={[5, 5, 0, 0]}
            barSize={8}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaBarChart;
