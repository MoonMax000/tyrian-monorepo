import { FC } from 'react';
import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Bar,
  ReferenceArea,
  ComposedChart,
  ReferenceLine,
} from 'recharts';
import { TimeRange } from './types';
import { CHART_COLORS } from './chartColors';
import CustomTooltip from './CustomTooltip';
import { formatXAxis, formatYAxisFG, formatYAxisRUB } from '@/utils/helpers/formatXY';
import { limitXTicks } from './limitXTicks';

export interface IFearGreedPoint {
  date: string;
  time: string;
  fearGreedIndex: number;
  btcPrice: number;
  btcVolume: number;
}

interface FearGreedChartProps {
  data: IFearGreedPoint[];
  className?: string;
  selectedTimeRange: TimeRange;
  lastPoint: number;
}

const FearGreedChart: FC<FearGreedChartProps> = ({ data, lastPoint, selectedTimeRange }) => {
  const filteredData = limitXTicks(data, 5, 'date');

  return (
    <div className='bg-transparent h-full flex flex-col relative'>
      <ResponsiveContainer width='100%' height='100%'>
        <ComposedChart data={data}>
          <defs>
            <linearGradient id='colorFearGreed' x1='0' y1='1' x2='0' y2='0'>
              <stop offset='0%' stopColor='red' stopOpacity={1} />
              <stop offset='50%' stopColor='yellow' stopOpacity={1} />
              <stop offset='100%' stopColor='green' stopOpacity={1} />
            </linearGradient>
          </defs>
          <YAxis
            yAxisId='left'
            stroke={CHART_COLORS.labelGray}
            tick={{ fill: CHART_COLORS.labelGray, dx: -55, textAnchor: 'start', fontSize: 12 }}
            strokeWidth={0}
            tickFormatter={formatYAxisRUB}
            domain={[0, 'auto']}
          />
          <YAxis
            yAxisId='right'
            orientation='right'
            stroke={CHART_COLORS.labelGray}
            tick={{ fill: CHART_COLORS.labelGray, dx: 40, textAnchor: 'end', fontSize: 12 }}
            ticks={[0, 20, 40, 60, 80, 100]}
            strokeWidth={0}
            tickFormatter={formatYAxisFG}
            domain={[0, 100]}
          />
          <YAxis yAxisId='bars' hide domain={[0, (dataMax: number) => dataMax * 5]} />
          <XAxis
            dataKey='date'
            tick={{ fill: CHART_COLORS.labelGray, dy: 10, fontSize: 12 }}
            ticks={filteredData.map((d) => d.date)}
            tickFormatter={(tick) => formatXAxis(tick, selectedTimeRange)}
          />
          <CartesianGrid vertical={false} stroke={CHART_COLORS.gridLine} />

          <ReferenceArea yAxisId='right' y1={80} y2={100} fill='#A06AFF29' fillOpacity={1} />
          <ReferenceArea yAxisId='right' y1={0} y2={20} fill='#FFB96A29' fillOpacity={1} />

          <ReferenceLine
            yAxisId='right'
            y={lastPoint}
            stroke='transparent'
            label={{
              position: 'right',
              value: lastPoint,
              fill: '#fff',
              fontSize: 13,
              dy: -5,
            }}
          />

          <Line
            yAxisId='left'
            dataKey='btcPrice'
            stroke={CHART_COLORS.lineChartGray}
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId='right'
            dataKey='fearGreedIndex'
            stroke='#6AA6FF'
            strokeWidth={2}
            dot={false}
          />
          <Tooltip
            content={
              <CustomTooltip
                labelMapping={{
                  btcPrice: 'BITCOIN PRICE',
                  btcVolume: 'BITCOIN VOLUME',
                  fearGreedIndex: 'Fear and Greed Index',
                }}
                colors={[
                  CHART_COLORS.lineChartGray,
                  CHART_COLORS.areaGradientStartBlue,
                  CHART_COLORS.barNeutral,
                ]}
                noFormatKeys={['fearGreedIndex']}
              />
            }
          />
          <Bar
            dataKey='btcVolume'
            yAxisId='bars'
            radius={[5, 5, 0, 0]}
            barSize={6}
            fill={CHART_COLORS.barNeutral}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div
        className='absolute right-[9%] top-[5%] text-white rounded-2xl uppercase font-semibold'
        style={{ padding: '8px', backgroundColor: '#A06AFF', fontSize: '8px' }}
      >
        strong Greed
      </div>
      <div
        className='absolute right-[9%] top-[74%] text-white rounded-2xl uppercase font-semibold'
        style={{ padding: '8px', backgroundColor: '#FFB96A', fontSize: '8px' }}
      >
        strong fear
      </div>
    </div>
  );
};

export default FearGreedChart;
