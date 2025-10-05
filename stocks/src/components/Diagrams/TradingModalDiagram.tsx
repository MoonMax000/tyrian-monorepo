'use client';

import type { FC } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { formatMoney } from '@/helpers/formatMoney';

interface ChartData {
  month: string;
  revenue: number;
  ebitda: number;
  netProfit: number;
  fcf: number;
  debtObligations: number;
}

interface TradingModalDiagramProps {
  data: ChartData[];
  width?: number | string;
  height?: number | string;
}

const TradingModalDiagram: FC<TradingModalDiagramProps> = ({
  data,
  width = '100%',
  height = '100%',
}) => {
  const colors = {
    revenue: { stroke: '#4A569D', fill: '#4A569D' },
    ebitda: { stroke: '#A8673F', fill: '#A8673F' },
    netProfit: { stroke: '#8B5CF6', fill: '#8B5CF6' },
    fcf: { stroke: '#059669', fill: '#059669' },
    debtObligations: { stroke: '#EF4444', fill: 'transparent' },
  };

  return (
    <ResponsiveContainer width={width} height={height}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#2E2744' />
        <XAxis
          dataKey='month'
          axisLine={{ stroke: '#523A83', strokeWidth: 3 }}
          tick={{ fill: '#B0B0B0', fontSize: 12, fontWeight: 700 }}
          minTickGap={10}
          interval='preserveStartEnd'
          tickMargin={5}
        />
        <YAxis
          axisLine={false}
          orientation='right'
          tick={{ fontSize: '12px', fontWeight: 700, fill: '#B0B0B0' }}
          tickLine={false}
          tickFormatter={(value) => formatMoney(value, '', 2)}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(30, 30, 40, 0.9)',
            border: 'none',
            borderRadius: '8px',
            padding: '10px',
          }}
          labelStyle={{ color: '#DDD', marginBottom: '5px' }}
          itemStyle={{ color: '#AAA' }}
          cursor={{ stroke: '#555', strokeWidth: 1 }}
        />
        <Area
          type='monotone'
          dataKey='revenue'
          stroke={colors.revenue.stroke}
          fill={colors.revenue.fill}
          fillOpacity={0.6}
          strokeWidth={2}
        />
        <Area
          type='monotone'
          dataKey='netProfit'
          stroke={colors.netProfit.stroke}
          fill={colors.netProfit.fill}
          fillOpacity={0.5}
          strokeWidth={2}
        />
        <Area
          type='monotone'
          dataKey='fcf'
          stroke={colors.fcf.stroke}
          fill={colors.fcf.fill}
          fillOpacity={0.4}
          strokeWidth={2}
        />
        <Area
          type='monotone'
          dataKey='ebitda'
          stroke={colors.ebitda.stroke}
          fill={colors.ebitda.fill}
          fillOpacity={0.3}
          strokeWidth={2}
        />
        <Area
          type='monotone'
          dataKey='debtObligations'
          stroke={colors.debtObligations.stroke}
          fill={colors.debtObligations.fill}
          fillOpacity={0.3}
          strokeWidth={2}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default TradingModalDiagram;
