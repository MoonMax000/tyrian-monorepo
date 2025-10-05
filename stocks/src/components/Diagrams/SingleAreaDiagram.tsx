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

interface DataItem {
  date: string;
  price: number;
}

type CustomTooltipProps = Pick<TooltipProps<number, 'price'>, 'active' | 'label' | 'payload'>;

const CustomTooltip: FC<CustomTooltipProps> = ({ active, label, payload }) => {
  if (active && payload && payload.length) {
    const data: DataItem = payload[0].payload;

    return (
      <div className='rounded-[4px] bg-white py-1 px-2 flex flex-col gap-1'>
        <p className='text-body-12 text-[#1F20387A]'>{label}</p>
        <p className='text-body-15 text-black font-medium'>{formatCurrency(data.price, {})}</p>
      </div>
    );
  }
  return null;
};

const tickFormatter = (value: number): string => {
  return value.toFixed(2);
};

interface SingleAreaDiagramProps {
  data: DataItem[];
  className?: string;
  withXAxis?: boolean;
  withYAxis?: boolean;
  areaType?: CurveType;
  id: string;
}

const SingleAreaDiagram: FC<SingleAreaDiagramProps> = ({
  data,
  className,
  withYAxis = true,
  withXAxis = true,
  areaType,
  id,
}) => {
  const modifiedData = data.map((item) => ({
    ...item,
    fillPrice: item.price * 0.95,
  }));

  const lineColorId = `${id}-lineColor`;

  return (
    <ResponsiveContainer width='100%' height='100%' className={className}>
      <AreaChart
        data={modifiedData}
        margin={{
          top: 20,
          right: 0,
          bottom: 20,
          left: 0,
        }}
      >
        <defs>
          <linearGradient id={lineColorId} x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor='#A06AFF7A' stopOpacity={1} />
            <stop offset='100%' stopColor='#181A20' stopOpacity={0.4} />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} stroke='#ffffff0d' />
        {withXAxis && (
          <XAxis
            axisLine={false}
            dataKey='date'
            tick={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', opacity: '90%' }}
            dy={8}
          />
        )}

        {withYAxis && (
          <YAxis
            axisLine={false}
            orientation='right'
            dataKey='price'
            tick={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', opacity: '90%' }}
            tickLine={false}
            tickFormatter={tickFormatter}
            dx={0}
            dy={-12}
          />
        )}

        <Tooltip
          content={<CustomTooltip />}
          cursor={{
            stroke: '#A06AFF7A',
            strokeWidth: 1,
            strokeDasharray: '2 2',
          }}
        />

        <Area
          type={areaType}
          dataKey='fillPrice'
          fill={`url(#${lineColorId})`}
          stroke='#a06aff'
          strokeWidth={2}
          strokeOpacity={48}
          pointerEvents='none'
          cursor='none'
          activeDot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SingleAreaDiagram;
