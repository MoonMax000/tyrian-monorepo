'use client';

import type { FC } from 'react';
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  TooltipProps,
} from 'recharts';
import ContentWrapper from '../UI/ContentWrapper';

type ComparisonBarData = {
  date: string;
  company: number;
  industry: number;
  market: number;
};

interface Props {
  data: ComparisonBarData;
  width?: number | string;
  height?: number | string;
  className?: string;
}

const CustomTooltip: FC<TooltipProps<number, string>> = ({ payload, active }) => {
  if (!active || !payload || payload.length === 0) return null;

  const colorMap: Record<string, string> = {
    company: '#A06AFF',
    industry: '#6AA5FF',
    market: '#FFA800',
  };

  return (
    <ContentWrapper className='p-2 flex flex-col gap-1 bg-[#1f1f1f] rounded-[4px]'>
      {payload.map((entry) => (
        <div key={entry.dataKey} className='flex items-center gap-2'>
          <span className='text-white font-medium' style={{ color: colorMap[entry.payload.key] }}>
            {entry.payload.name}:
          </span>
          <span className='text-white' style={{ color: colorMap[entry.payload.key] }}>
            {entry?.value?.toFixed(2) ?? 0}%
          </span>
        </div>
      ))}
    </ContentWrapper>
  );
};

const ComparisonBarChart: FC<Props> = ({ data, width = '100%', height = 250, className }) => {
  const chartData = [
    { name: 'Company', value: data.company, key: 'company' },
    { name: 'Industry', value: data.industry, key: 'industry' },
    { name: 'Market', value: data.market, key: 'market' },
  ];

  return (
    <ResponsiveContainer width={width} height={height} className={className}>
      <BarChart data={chartData} margin={{ left: 5 }}>
        <CartesianGrid stroke='#2E2744' vertical={false} strokeWidth={2} />
        <XAxis
          dataKey='date'
          tick={({ x, y, payload }) => {
            if (payload.index === 1) {
              return (
                <text
                  x={x}
                  y={y + 20}
                  textAnchor='middle'
                  fill='#B0B0B0'
                  fontSize={12}
                  fontWeight={700}
                >
                  {data.date}
                </text>
              );
            }
            return <></>;
          }}
          axisLine={false}
        />
        <YAxis
          tickFormatter={(v) => `${v}%`}
          tick={{ fill: '#B0B0B0', fontSize: 12, fontWeight: 700 }}
          axisLine={false}
          tickLine={false}
          width={31}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />

        <Bar dataKey='value' radius={[6, 6, 0, 0]} className='hover:bg-none'>
          {chartData.map((entry, index) => {
            const gradientId =
              entry.key === 'company'
                ? 'gradient-purple'
                : entry.key === 'industry'
                  ? 'gradient-blue'
                  : 'gradient-orange';

            return <Cell key={`cell-${index}`} fill={`url(#${gradientId})`} />;
          })}
        </Bar>
        <defs>
          <linearGradient id='gradient-purple' x1='0' y1='1' x2='0' y2='0'>
            <stop offset='0%' stopColor='#181A20' />
            <stop offset='100%' stopColor='#A06AFF' />
          </linearGradient>
          <linearGradient id='gradient-blue' x1='0' y1='1' x2='0' y2='0'>
            <stop offset='0%' stopColor='#181A20' />
            <stop offset='100%' stopColor='#6AA5FF' />
          </linearGradient>
          <linearGradient id='gradient-orange' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='20%' stopColor='#FFA800' />
            <stop offset='100%' stopColor='#181A20' />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ComparisonBarChart;
