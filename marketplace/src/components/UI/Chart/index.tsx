'use client';

import { FC, useMemo, useCallback } from 'react';
import { AreaChart, Area, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { CurveType } from 'recharts/types/shape/Curve';
import { Margin } from 'recharts/types/util/types';

export interface DataItem {
  time: number;
  value: number;
  volume: number;
  medianPrice: number;
}

interface AreaDiagramProps {
  data: DataItem[];
  className?: string;
  withXAxis?: boolean;
  withYAxis?: boolean;
  variant?: 'positive' | 'negative';
  areaType?: CurveType;
  id: string;
  margin?: Margin;
}

const variants: Record<NonNullable<AreaDiagramProps['variant']>, string> = {
  positive: '#A06AFF',
  negative: '#EF454A',
};

const Chart: FC<AreaDiagramProps> = ({
  data,
  className,
  withYAxis = true,
  withXAxis = true,
  variant = 'positive',
  areaType,
  id,
  margin = { top: 20, bottom: 20, left: -20 },
}) => {
  const primaryColor = variants[variant];

  const modifiedData = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        fillPrice: item.value * 0.95,
      })),
    [data],
  );

  const tickFormatter = useCallback((value: number): string => {
    const sign = value < 0 ? '-' : '';
    const absValue = Math.abs(value);

    if (absValue >= 1_000) {
      if (absValue > 1_000_000_000) {
        return `${sign}${Math.round(absValue / 10_000_000).toFixed(1)}B`;
      }
      if (absValue > 1_000_000) {
        return `${sign}${Math.round(absValue / 10_000).toFixed(1)}М`;
      }
      return `${sign}${Math.round(absValue / 1_000).toFixed(1)}К`;
    }
    return `${value}`;
  }, []);

  const { max, min, diff } = useMemo(() => {
    const max = Math.max(...data.map((el) => el.value));
    const min = Math.min(...data.map((el) => el.value));
    const diff = max - min;
    return { max, min, diff };
  }, [data]);

  const ticksY = useMemo(() => {
    const start = Math.max(min - diff * 0.2, 0);
    const end = max + diff * 0.2;
    const diffTmp = end - start;

    const result = [
      ...new Set(
        [...new Array(6)].map((_, index, array) => {
          const totalSteps = array.length;
          const value = start + (diffTmp / totalSteps) * index;
          return Math.max(0, +value);
        }),
      ),
    ];

    if (result.length === 1) {
      result.push(result[0] * 2);
      result.unshift(result[0] * 0.1);
    }
    return result;
  }, [max, min]);

  const gradients = useMemo(
    () => (
      <>
        <defs>
          <linearGradient id={`${id}-colorPrice`} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor={primaryColor} stopOpacity={0.32} />
            <stop offset='100%' stopColor='#181A20' stopOpacity={0} />
          </linearGradient>
          <linearGradient id={`${id}-colorPv`} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor={primaryColor} stopOpacity={0.32} />
            <stop offset='100%' stopColor='#181A20' stopOpacity={0} />
          </linearGradient>
          <linearGradient id={`${id}-lineColor`} x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor={primaryColor} />
            <stop offset='1%' stopColor={primaryColor} />
            <stop offset='90%' stopColor={primaryColor} />
          </linearGradient>
        </defs>
      </>
    ),
    [id, primaryColor],
  );

  return (
    <ResponsiveContainer width='100%' height='100%' className={className}>
      <AreaChart data={modifiedData} margin={margin}>
        {gradients}

        <CartesianGrid vertical={false} stroke='#ffffff0d' />

        {withXAxis && (
          <YAxis
            dy={10}
            axisLine={false}
            dataKey='value'
            tick={{ fontSize: '12px', fontWeight: 500, color: '#FFF' }}
            tickLine={false}
            ticks={ticksY}
            domain={[(dataMin: number) => dataMin, (dataMax: number) => dataMax]}
            tickFormatter={tickFormatter}
          />
        )}

        {withYAxis && (
          <YAxis
            axisLine={false}
            dataKey='value'
            tick={{ fontSize: '10px', fontWeight: 500, color: '#FFF' }}
            tickLine={false}
            domain={[
              (dataMin: number) => dataMin - (diff || 1) * 0.1,
              (dataMax: number) => dataMax + (diff || 1) * 0.1,
            ]}
          />
        )}

        <Area
          type={areaType}
          dataKey='value'
          strokeWidth={1.5}
          stroke={primaryColor}
          style={{ filter: `drop-shadow(0px 0px 6px ${primaryColor})` }}
          fill='transparent'
        />

        <Area
          type={areaType}
          dataKey='fillPrice'
          fill={`url(#${id}-colorPv)`}
          strokeWidth={0}
          pointerEvents='none'
          cursor='none'
          activeDot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Chart;
