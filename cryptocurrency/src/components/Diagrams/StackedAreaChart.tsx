import { FC } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { TimeRange } from './types';
import CustomTooltip from './CustomTooltip';
import { CHART_COLORS } from './chartColors';
import { formatXAxis, formatYAxis } from '@/utils/helpers/formatXY';
import { limitXTicks } from './limitXTicks';

export interface IMarketCapPoint {
  date: string;
  time: string;
  btcValue: number;
  ethValue: number;
  stableValue: number;
  otherValue: number;
}

interface AreaChartProps {
  data: IMarketCapPoint[];
  className?: string;
  selectedTimeRange: TimeRange;
}

const StackedAreaChart: FC<AreaChartProps> = ({ data, className, selectedTimeRange }) => {
  const filteredData = limitXTicks(data, 6, 'date');

  return (
    <div className='bg-transparent h-full flex flex-col'>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart data={data} margin={{ top: 30, right: 5 }}>
          <defs>
            <linearGradient id='colorBtc' x1='0' y1='0' x2='0' y2='1'>
              <stop
                offset='10%'
                stopColor={CHART_COLORS.areaGradientStartOrange}
                stopOpacity={0.8}
              />
              <stop offset='95%' stopColor={CHART_COLORS.areaGradientEnd} stopOpacity={0} />
            </linearGradient>
            <linearGradient id='colorEth' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='10%' stopColor={CHART_COLORS.areaGradientStartBlue} stopOpacity={0.8} />
              <stop offset='95%' stopColor={CHART_COLORS.areaGradientEnd} stopOpacity={0} />
            </linearGradient>
            <linearGradient id='colorStablecoins' x1='0' y1='0' x2='0' y2='1'>
              <stop
                offset='10%'
                stopColor={CHART_COLORS.areaGradientStartGreen}
                stopOpacity={0.8}
              />
              <stop offset='95%' stopColor={CHART_COLORS.areaGradientEnd} stopOpacity={0} />
            </linearGradient>
            <linearGradient id='colorOthers' x1='0' y1='0' x2='0' y2='1'>
              <stop
                offset='10%'
                stopColor={CHART_COLORS.areaGradientStartWhite}
                stopOpacity={0.8}
              />
              <stop offset='95%' stopColor={CHART_COLORS.areaGradientEnd} stopOpacity={0} />
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
            ticks={filteredData.map((d) => d.date)}
            tickFormatter={(tick) => formatXAxis(tick, selectedTimeRange)}
          />
          <Tooltip content={<CustomTooltip />} />
          <CartesianGrid vertical={false} stroke={CHART_COLORS.gridLine} />
          <Area
            yAxisId='right'
            dataKey='btcValue'
            stroke={CHART_COLORS.areaGradientStartOrange}
            fillOpacity={1}
            fill='url(#colorBtc)'
            name='BTC'
          />
          <Area
            yAxisId='right'
            dataKey='ethValue'
            stroke={CHART_COLORS.areaGradientStartBlue}
            fillOpacity={1}
            fill='url(#colorEth)'
            name='ETH'
          />
          <Area
            yAxisId='right'
            dataKey='stableValue'
            stroke={CHART_COLORS.areaGradientStartGreen}
            fillOpacity={1}
            fill='url(#colorStablecoins)'
            name='STABLECOINS'
          />
          <Area
            yAxisId='right'
            dataKey='otherValue'
            stroke={CHART_COLORS.areaGradientStartWhite}
            fillOpacity={1}
            fill='url(#colorOthers)'
            name='OTHER'
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedAreaChart;
