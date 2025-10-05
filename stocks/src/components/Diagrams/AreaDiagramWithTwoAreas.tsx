'use client';

import { formatCurrency } from '@/helpers/formatCurrency';
import clsx from 'clsx';
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
  date: string;
  priceFirstStock: number;
  priceSecondStock: number;
  pv: number;
  amt: number;
}

type CustomTooltipProps = Pick<TooltipProps<number, 'price'>, 'active' | 'label' | 'payload'>;

const CustomTooltip: FC<CustomTooltipProps> = ({ active, label, payload }) => {
  if (active && payload && payload.length) {
    const data: DataItem = payload[0].payload;
    return (
      <div className='rounded-[4px] bg-white py-1 px-2 flex flex-col gap-1'>
        <p className='text-body-12 text-[#1F20387A]'>{label}</p>
        <p className='text-body-15 text-[#1F20387A] font-medium'>
          {formatCurrency(data.priceFirstStock, {})}
        </p>
        <p className='text-body-15 font-medium text-[#1F20387A]'>{data.pv}</p>
      </div>
    );
  }
  return null;
};

const tickFormatter = (value: number): string => {
  return value.toFixed(2);
};

interface AreaDiagramProps {
  data: DataItem[];
  className?: string;
  withXAxis?: boolean;
  withYAxis?: boolean;
  areaType?: CurveType;
  id: string;
  margin?: Margin;
}

const AreaDiagramWithTwoAreas: FC<AreaDiagramProps> = ({
  data,
  className,
  withYAxis = true,
  withXAxis = true,
  areaType,
  id,
  margin = {
    top: 20,
    bottom: 20,
    left: -20,
    right: 0,
  },
}) => {
  const primaryColor = '#1F232700';

  const firstStockId = `${id}-firstStock`;
  const secondStockId = `${id}-secondStock`;

  return (
    <ResponsiveContainer width='100%' height='100%' className={className}>
      <AreaChart data={data} margin={margin}>
        <defs>
          <linearGradient id={firstStockId} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor='#A06AFF7A' stopOpacity={1} />
            <stop offset='50%' stopColor='#A06AFF3D' stopOpacity={1} />
            <stop offset='95%' stopColor='#1F232700' stopOpacity={0.4} />
          </linearGradient>
          <linearGradient id={secondStockId} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor='#6AA5FF7A' stopOpacity={1} />
            <stop offset='50%' stopColor='#6AA5FF3D' stopOpacity={1} />
            <stop offset='90%' stopColor='#1F232700' stopOpacity={0.4} />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} stroke='#FFFFFF0A' />
        {withXAxis && (
          <XAxis
            axisLine={false}
            dataKey='date'
            fill={`url(#${firstStockId})`}
            className='mt-3 ml-5'
            tick={{ fontSize: '12px', fontWeight: 500, color: '#FFF' }}
            dy={8}
          />
        )}

        {withYAxis && (
          <YAxis
            axisLine={false}
            dataKey='priceFirstStock'
            tick={{ fontSize: '12px', fontWeight: 500, color: '#FFF' }}
            tickLine={false}
            tickFormatter={tickFormatter}
            orientation='right'
          />
        )}

        <Tooltip
          content={<CustomTooltip />}
          cursor={{
            stroke: primaryColor,
            strokeWidth: 1,
            strokeDasharray: '2 2',
          }}
        />

        <Area
          type={areaType}
          dataKey='priceFirstStock'
          strokeWidth={2}
          stroke='#A06AFF'
          fill={`url(#${firstStockId})`}
          pointerEvents='none'
          cursor='none'
          activeDot={false}
          isAnimationActive={false}
        />

        <Area
          type={areaType}
          dataKey='priceSecondStock'
          strokeWidth={2}
          stroke='#6AA5FF'
          fill={`url(#${secondStockId})`}
          pointerEvents='none'
          cursor='none'
          activeDot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaDiagramWithTwoAreas;
