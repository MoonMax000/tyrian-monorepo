'use client';

import { formatMoney } from '@/helpers/formatMoney';
import { FC } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CurveType } from 'recharts/types/shape/Curve';

export interface IQuotationChartEl {
  date: string;
  revenue: number;
  ebitda: number;
  netIncome: number;
  freeCashFlow: number;
  totalLiabilities: number;
}

interface QuotationDiagramProps {
  data: IQuotationChartEl[];
  className?: string;
  areaType?: CurveType;
  id: string;
}

const QuotationDiagram: FC<QuotationDiagramProps> = ({ data, className, id }) => {
  const fieldNames = [
    { key: 'ebitda', label: 'EBITDA' },
    { key: 'freeCashFlow', label: 'FCF' },
    { key: 'netIncome', label: 'Net profit' },
    { key: 'revenue', label: 'Revenue' },
    { key: 'totalLiabilities', label: 'Debt obligations' },
  ];

  const colors = [
    { id: `${id}-lineColor1`, color: '#6AA6FF' },
    { id: `${id}-lineColor2`, color: '#A06AFF' },
    { id: `${id}-lineColor3`, color: '#FF6A79' },
    { id: `${id}-lineColor4`, color: '#FFB46A' },
    { id: `${id}-lineColor5`, color: '#6AFF9C' },
  ];

  return (
    <ResponsiveContainer width='100%' height='100%' className={className}>
      <AreaChart
        data={data}
        margin={{
          top: 20,
          right: -80,
          bottom: 20,
          left: 0,
        }}
      >
        <defs>
          {colors.map(({ id, color }) => (
            <linearGradient key={id} id={id} x1='0%' y1='0%' x2='40%' y2='100%'>
              <stop offset='0' stopColor={`${color}`} stopOpacity={1} />
              <stop offset='100' stopColor='#181A2000' stopOpacity={0.4} />
            </linearGradient>
          ))}
        </defs>

        <CartesianGrid vertical={false} stroke='#ffffff0d' />

        <XAxis
          axisLine={false}
          dataKey='date'
          tickFormatter={(value) => value.split(' ')[0]}
          tick={{ fontSize: '12px', fontWeight: 700, fill: '#FFF', opacity: 0.48 }}
          dy={8}
        />

        <YAxis
          axisLine={false}
          orientation='right'
          tick={{
            fontSize: '12px',
            fontWeight: 700,
            fill: '#FFF',
            opacity: 0.48,
            textAnchor: 'end',
          }}
          tickLine={false}
          tickFormatter={(value) => formatMoney(value, '$', 2)}
          width={80}
          dx={-10}
          dy={-10}
        />

        <Tooltip
          cursor={{
            stroke: '#A06AFF7A',
            strokeWidth: 1,
            strokeDasharray: '5 5',
          }}
        />

        {fieldNames.map(({ key, label }, index) => (
          <Area
            key={colors[index].id}
            dataKey={key}
            name={label}
            fill={`url(#${colors[index].id})`}
            stroke={colors[index].color}
            strokeWidth={2}
            strokeOpacity={48}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default QuotationDiagram;
