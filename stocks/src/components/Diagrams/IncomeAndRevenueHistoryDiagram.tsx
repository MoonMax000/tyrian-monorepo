import { FC } from 'react';
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { IIncomeAndRevenueHistory } from '@/screens/HomeScreen/components/Tabs/Review/components/IncomeAndRevenueHistory';
import { formatMoney } from '@/helpers/formatMoney';

interface IBarDiagramProps {
  data: IIncomeAndRevenueHistory[];
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const procentFormatter = (value: number): string => {
  console.log('procent', value);
  return `${value}%`;
};

const IncomeAndRevenueHistoryDiagram: FC<IBarDiagramProps> = ({
  data,
  width = '100%',
  height = '100%',
  className,
}) => {
  return (
    <ResponsiveContainer width={width} height={height} className={className}>
      <ComposedChart data={data} margin={{ left: 10, top: 15, right: 10 }} barGap={4}>
        <defs>
          <linearGradient id='debt-gradient-positive' x1='0%' y1='0%' x2='0%' y2='100%'>
            <stop offset='0%' stopColor='#FFA800' />
            <stop offset='100%' stopColor='#181A20' />
          </linearGradient>

          <linearGradient id='debt-gradient-negative' x1='0%' y1='100%' x2='0%' y2='0%'>
            <stop offset='0%' stopColor='#FFA800' />
            <stop offset='100%' stopColor='#181A20' />
          </linearGradient>

          <linearGradient id='revenue-gradient-positive' x1='0%' y1='0%' x2='0%' y2='100%'>
            <stop offset='0%' stopColor='#A06AFF' />
            <stop offset='100%' stopColor='#181A20' />
          </linearGradient>
          <linearGradient id='revenue-gradient-negative' x1='0%' y1='100%' x2='0%' y2='0%'>
            <stop offset='0%' stopColor='#A06AFF' />
            <stop offset='100%' stopColor='#181A20' />
          </linearGradient>

          <linearGradient id='income-gradient-positive' x1='0%' y1='0%' x2='0%' y2='100%'>
            <stop offset='0%' stopColor='#6AA5FF' />
            <stop offset='100%' stopColor='#181A20' />
          </linearGradient>
          <linearGradient id='income-gradient-negative' x1='0%' y1='100%' x2='0%' y2='0%'>
            <stop offset='0%' stopColor='#6AA5FF' />
            <stop offset='100%' stopColor='#181A20' />
          </linearGradient>
        </defs>

        <XAxis
          axisLine={false}
          dataKey='date'
          tick={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF' }}
          dy={8}
        />

        <YAxis
          orientation='left'
          domain={['auto', 'dataMax']}
          yAxisId='revenue'
          axisLine={false}
          tick={{ fontSize: '12px', fontWeight: 700, color: '#B0B0B0' }}
          tickLine={false}
          tickFormatter={(value) => formatMoney(value, '', 2)}
          dx={-12}
        />
        <YAxis
          orientation='right'
          yAxisId='profit'
          dataKey='procent'
          axisLine={false}
          tick={{ fontSize: '12px', fontWeight: 700, color: '#B0B0B0' }}
          tickLine={false}
          tickFormatter={procentFormatter}
          dx={35}
        />
        <Tooltip
          labelFormatter={(label) => {
            const d = new Date(label);
            return !isNaN(d.getTime()) ? d.getFullYear().toString() : label;
          }}
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              const d = new Date(label);
              const year = !isNaN(d.getTime()) ? d.getFullYear() : label;

              return (
                <div
                  style={{
                    background: '#1f1f1f',
                    borderRadius: 10,
                    padding: '8px 12px',
                    color: '#fff',
                  }}
                >
                  <div style={{ color: '#B0B0B0' }}>{year}</div>

                  {payload.map((entry, index) => {
                    let displayValue = entry.value;
                    if (entry.dataKey === 'profit')
                      displayValue = procentFormatter(entry.value as number);
                    else if (typeof entry.value === 'number')
                      displayValue = formatMoney(entry.value, '$', 2);

                    return (
                      <div key={`item-${index}`} style={{ color: entry.color }}>
                        {entry.name}: {displayValue}
                      </div>
                    );
                  })}
                </div>
              );
            }
            return null;
          }}
          cursor={{
            stroke: '#A06AFF7A',
            strokeWidth: 1,
            strokeDasharray: '2 2',
          }}
        />
        <CartesianGrid stroke='#2E2744' vertical={false} strokeWidth={2} />

        <Bar dataKey='revenue' barSize={21} yAxisId='revenue' radius={[4, 4, 0, 0]} fill='#A06AFF'>
          {data.map((entry, index) => (
            <Cell
              key={`movement-${index}`}
              fill={
                entry.revenue >= 0
                  ? 'url(#revenue-gradient-positive)'
                  : 'url(#revenue-gradient-negative)'
              }
            />
          ))}
        </Bar>

        <Bar dataKey='income' barSize={24} yAxisId='revenue' radius={[4, 4, 4, 4]} fill='#6AA5FF'>
          {data.map((entry, index) => (
            <Cell
              key={`income-${index}`}
              fill={
                entry.income >= 0
                  ? 'url(#income-gradient-positive)'
                  : 'url(#income-gradient-negative)'
              }
            />
          ))}
        </Bar>

        <Line
          yAxisId='revenue'
          type='monotone'
          dataKey='profit'
          dot={{
            stroke: '#FFA800',
            strokeWidth: 2,
            fill: '#FFA800',
            r: 4,
          }}
          stroke='#FFA800'
          strokeWidth={2}
        />
        <ReferenceLine y={0} yAxisId='revenue' stroke='#523A83' strokeWidth={2} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default IncomeAndRevenueHistoryDiagram;
