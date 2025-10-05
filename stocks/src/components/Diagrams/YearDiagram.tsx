'use client';

import { formatCurrency } from '@/helpers/formatCurrency';
import { FC } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { CurveType } from 'recharts/types/shape/Curve';
import { Margin } from 'recharts/types/util/types';

interface DataItem {
  month: string;
  price: number;
}

type CustomTooltipProps = Pick<TooltipProps<number, 'price'>, 'active' | 'label' | 'payload'>;

const CustomTooltip: FC<CustomTooltipProps> = ({ active, label, payload }) => {
  if (active && payload && payload.length) {
    const data: DataItem = payload[0].payload;

    return (
      <div className='rounded-lg bg-[#1f1f1f] py-2 px-3 flex flex-col gap-1'>
        <span className='text-[15px] text-[#B0B0B0]'>{label}</span>
        <span className='text-[15px] font-medium text-white flex items-center gap-2  text-[#A06AFF]'>
          {formatCurrency(data.price, {})}
        </span>
      </div>
    );
  }
  return null;
};

const tickFormatter = (value: number): string => {
  if (value >= 1000) return `${value / 1000}K`;
  return value.toFixed(0);
};

interface AreaDiagramProps {
  data: DataItem[];
  className?: string;
  withXAxis?: boolean;
  withYAxis?: boolean;
  areaType?: CurveType;
  id: string;
  strokeColor?: string;
  colors?: [string, string];
  yAxisDx?: number;
  yAxisDy?: number;
  margin?: Margin;
  dot?: boolean;
}

const YearDiagram: FC<AreaDiagramProps> = ({
  data,
  className,
  withYAxis = true,
  withXAxis = true,
  areaType,
  id,
  strokeColor = '#A06AFF',
  colors = ['#A06AFF7A', '#181A20'],
  yAxisDx = -60,
  yAxisDy = -12,
  margin = { top: 20, right: -60, bottom: 20, left: 0 },
  dot = false,
}) => {
  const modifiedData = data.map((item) => ({
    ...item,
    fillPrice: item.price * 0.95,
  }));

  const gradientId = `${id}-gradient`;

  return (
    <ResponsiveContainer width='100%' height='100%' className={className}>
      <AreaChart data={modifiedData} margin={margin}>
        <defs>
          <linearGradient id={gradientId} x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor={colors[0]} stopOpacity={1} />
            <stop offset='100%' stopColor={colors[1]} stopOpacity={0.4} />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} stroke='#ffffff0d' />

        {withXAxis && (
          <XAxis
            axisLine={false}
            dataKey='month'
            tick={{ fontSize: 12, fontWeight: 700, fill: '#B0B0B0' }}
            dy={8}
          />
        )}

        {withYAxis && (
          <YAxis
            axisLine={false}
            orientation='right'
            dataKey='price'
            tick={{ fontSize: 12, fontWeight: 700, fill: '#B0B0B0' }}
            tickLine={false}
            tickFormatter={tickFormatter}
            dx={yAxisDx}
            dy={yAxisDy}
          />
        )}

        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: '#A06AFF7A', strokeWidth: 1, strokeDasharray: '2 2' }}
        />

        <Area
          type={areaType}
          dataKey='fillPrice'
          fill={`url(#${gradientId})`}
          stroke={strokeColor}
          strokeWidth={2}
          pointerEvents='none'
          dot={dot}
          activeDot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default YearDiagram;
