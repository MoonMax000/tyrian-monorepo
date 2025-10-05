import { FC } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';
import IconCircle from '@/assets/icons/circleWithLine.svg';

export interface DataItem {
  date: string;
  currentPercent: number;
  percentOneMonthAgo: number;
  percentOneYearAgo: number;
}

interface AreaDiagramProps {
  data: DataItem[];
  className?: string;
  withXAxis?: boolean;
  withYAxis?: boolean;
}

const legendItems = [
  { label: 'Current price', color: '#A06AFF' },
  { label: '1 month ago', color: '#6AA6FF' },
  { label: '1 year ago', color: '#FFA800' },
];

const tickFormatter = (value: number): string => {
  return `${value}%`;
};

type CustomTooltipProps = Pick<TooltipProps<number, 'price'>, 'active' | 'label' | 'payload'>;

const CustomTooltip: FC<CustomTooltipProps> = ({ active, label, payload }) => {
  if (active && payload && payload.length) {
    const data: DataItem = payload[0].payload;

    return (
      <div className='rounded-[4px] bg-white py-1 px-2 flex flex-col gap-1'>
        <p className='text-body-12 text-[#1F20387A]'>{label}</p>
        <p className='text-body-15 text-black font-medium'>Current price: {data.currentPercent}</p>
        <p className='text-body-15 text-black font-medium'>
          1 month ago: {data.percentOneMonthAgo}
        </p>
        <p className='text-body-15 text-black font-medium'>1 year ago: {data.percentOneYearAgo}</p>
      </div>
    );
  }
  return null;
};

const AreaDiagramWithThreeArea: FC<AreaDiagramProps> = ({
  data,
  className,
  withXAxis = true,
  withYAxis = true,
}) => {
  return (
    <>
      <ResponsiveContainer width='100%' height='100%' className={className}>
        <AreaChart data={data} margin={{ left: -10 }}>
          <CartesianGrid vertical={false} stroke='#ffffff0d' />
          {withXAxis && (
            <XAxis
              axisLine={false}
              dataKey='date'
              tick={{ fontSize: '12px', fontWeight: 700, fill: '#808283' }}
              dy={8}
            />
          )}

          {withYAxis && (
            <YAxis
              axisLine={false}
              dataKey='currentPercent'
              tick={{ fontSize: '12px', fontWeight: 700, fill: '#808283' }}
              tickLine={false}
              tickFormatter={tickFormatter}
              dx={10}
            />
          )}

          <Area
            dataKey='currentPercent'
            fill='transparent'
            stroke='#A06AFF'
            strokeWidth={2}
            strokeOpacity={48}
            pointerEvents='none'
            cursor='none'
            activeDot={false}
            dot
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: '#A06AFF7A',
              strokeWidth: 1,
              strokeDasharray: '2 2',
            }}
          />

          <Area
            dataKey='percentOneMonthAgo'
            fill='transparent'
            stroke='#6AA6FF'
            strokeWidth={2}
            strokeOpacity={48}
            pointerEvents='none'
            cursor='none'
            activeDot={false}
            dot
          />

          <Area
            dataKey='percentOneYearAgo'
            fill='transparent'
            stroke='#FFA800'
            strokeWidth={2}
            strokeOpacity={48}
            pointerEvents='none'
            cursor='none'
            activeDot={false}
            dot
          />
          <ReferenceLine y={0} stroke='#FFFFFF29' strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>

      <ul className='flex items-center justify-center gap-4 mt-4'>
        {legendItems.map((item, index) => (
          <li key={item.color + index} className='flex items-center gap-2'>
            <IconCircle style={{ color: item.color }} />
            <span className='text-body-12 uppercase opacity-48'>{item.label}</span>
          </li>
        ))}
      </ul>
    </>
  );
};

export default AreaDiagramWithThreeArea;
