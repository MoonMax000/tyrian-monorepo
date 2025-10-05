'use client';

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
import { formatCurrency } from '@/helpers/formatCurrency';
import { getBrightColorFromString } from '@/helpers/getBrightColorFromString';
import { formatMoney } from '@/helpers/formatMoney';

interface DataItem {
  month: string;
  year: string;
  [key: `price_${string}`]: number;
}

// Тип для пропсов тултипа
type CustomTooltipProps = Pick<TooltipProps<any, string>, 'active' | 'label' | 'payload'>;

const CustomTooltip: FC<CustomTooltipProps> = ({ active, label, payload }) => {
  if (active && payload && payload.length) {
    const currentMonth = label;

    return (
      <div className='rounded-[4px] bg-white py-1 px-2 flex flex-col gap-1 shadow-md'>
        <p className='text-body-12 text-[#1F20387A]'>{currentMonth}</p>
        {payload.map((entry, index) => {
          if (entry.dataKey && typeof entry.value === 'number') {
            const companyName = String(entry.name || (entry.dataKey as string).split('_')[1]);
            return (
              <p key={`item-${index}`} className='text-body-15 text-black font-medium'>
                <span style={{ color: entry.stroke || entry.color }}>{companyName}:</span>{' '}
                {formatCurrency(entry.value, {})}
              </p>
            );
          }
          return null;
        })}
      </div>
    );
  }
  return null;
};

interface AreaDiagramProps {
  data: DataItem[];
  className?: string;
  withXAxis?: boolean;
  withYAxis?: boolean;
  areaType?: CurveType;
  id: string;
  yAxisDx?: number;
  yAxisDy?: number;
  margin?: Margin;
  dot?: boolean;
  width?: string | number;
  height?: string | number;
  currencySymbol?: string;
}

const YearComposedDiagram: FC<AreaDiagramProps> = ({
  data,
  className,
  withYAxis = true,
  withXAxis = true,
  areaType = 'monotone',
  id,
  yAxisDx = -60,
  yAxisDy = -12,
  margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 0,
  },
  dot = false,
  width = '100%',
  height = 250,
  currencySymbol,
}) => {
  const priceKeys: `price_${string}`[] =
    data.length > 0
      ? (Object.keys(data[0]) as Array<keyof DataItem>).filter((key): key is `price_${string}` =>
          key.startsWith('price_'),
        )
      : [];

  const yearFormatter = (month: string, index: number) => {
    if (!data || data.length === 0 || !data[index]) {
      return month;
    }
    const year = data[index].year;
    return `${month}'${year.slice(-2)}`;
  };

  return (
    <ResponsiveContainer width={width} height={height} className={className}>
      <AreaChart data={data} margin={margin}>
        <defs>
          {priceKeys.map((key, i) => {
            const subject = key.split('_')[1];
            const lineColor = getBrightColorFromString(subject);
            const gradientId = `${subject}-gradient`;

            return (
              <linearGradient key={gradientId} id={gradientId} x1='0%' y1='0%' x2='0%' y2='100%'>
                <stop offset='0%' stopColor={lineColor} stopOpacity={0.8} />
                <stop offset='100%' stopColor={lineColor} stopOpacity={0.1} />
              </linearGradient>
            );
          })}
        </defs>

        <CartesianGrid vertical={false} stroke='#ffffff0d' />
        {withXAxis && (
          <XAxis
            axisLine={{ stroke: '#2E2744', strokeWidth: 2 }}
            tickLine={{ stroke: '#2E2744', strokeWidth: 2 }}
            dataKey='month'
            tick={{ fontSize: '12px', fontWeight: 700, fill: '#B0B0B0' }}
            tickFormatter={yearFormatter}
            dy={8}
            interval='preserveStartEnd'
          />
        )}

        {withYAxis && (
          <YAxis
            axisLine={false}
            orientation='right'
            tick={{ fontSize: '12px', fontWeight: 700, fill: '#B0B0B0' }}
            tickLine={false}
            tickFormatter={(value) => formatMoney(value, currencySymbol, 2)}
            dx={yAxisDx}
            dy={yAxisDy}
          />
        )}

        <Tooltip
          content={<CustomTooltip />}
          cursor={{
            stroke: '#A06AFF7A',
            strokeDasharray: '2 2',
          }}
        />

        {priceKeys.map((key, i) => {
          const subject = key.split('_')[1];
          const lineColor = getBrightColorFromString(subject);
          const gradientId = `${subject}-gradient`;
          return (
            <Area
              key={key}
              type={areaType}
              dataKey={key}
              name={subject.toUpperCase()}
              fill={`url(#${gradientId})`}
              stroke={lineColor}
              strokeWidth={2}
              strokeOpacity={0.8}
              fillOpacity={0.5}
              pointerEvents='auto'
              cursor='pointer'
              activeDot={false}
              dot={dot}
            />
          );
        })}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default YearComposedDiagram;
