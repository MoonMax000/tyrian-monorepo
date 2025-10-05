import { FC } from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatMoney } from '@/helpers/formatMoney';
import type { IFinanceIndicatorEl } from './constants';

type ProfitHistoryItem = Pick<IFinanceIndicatorEl, 'date' | 'operating_profit' | 'revenue'> & {
  profitability: number;
};

interface IBarDiagramProps {
  data: ProfitHistoryItem[];
  width?: string | number;
  height?: string | number;
  className?: string;
}

const formatPercent = (v: number) => `${v}%`;

const HistoryofProfitDiagram: FC<IBarDiagramProps> = ({
  data,
  width = '100%',
  height = '100%',
  className,
}) => {
  return (
    <ResponsiveContainer width={width} height={height} className={className}>
      <ComposedChart data={data} barGap={30}>
        <defs>
          <linearGradient id='revenueGradient' x1='0' y1='1' x2='0' y2='0'>
            <stop offset='0%' stopColor='#181A20' />
            <stop offset='100%' stopColor='#A06AFF' />
          </linearGradient>
          <linearGradient id='profitGradient' x1='0' y1='1' x2='0' y2='0'>
            <stop offset='0%' stopColor='#181A20' />
            <stop offset='100%' stopColor='#6AA5FF' />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke='#2E2744' />
        <XAxis
          dataKey='date'
          tick={{ fill: '#B0B0B0', fontSize: 12, fontWeight: 700 }}
          dy={4}
          stroke='#2E2744'
          strokeWidth={2}
        />
        <YAxis
          yAxisId='left'
          tickFormatter={(value) => formatMoney(value, '$', 2)}
          tick={{ fill: '#B0B0B0', fontSize: 12, fontWeight: 700 }}
          axisLine={false}
          tickLine={false}
          dx={-20}
        />
        <YAxis
          yAxisId='right'
          orientation='right'
          tickFormatter={formatPercent}
          domain={[0, 100]}
          tick={{ fill: '#B0B0B0', fontSize: 12, fontWeight: 700 }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;

            return (
              <div
                style={{
                  backgroundColor: '#1f1f1f',
                  borderRadius: 10,
                  padding: '8px 12px',
                  color: '#fff',
                }}
              >
                <p style={{ margin: 0, color: '#B0B0B0' }}>{label}</p>
                {payload.map((entry) => {
                  let color = '#fff';
                  if (entry.dataKey === 'profitability') color = '#FFA800';
                  if (entry.dataKey === 'revenue') color = '#A06AFF';
                  if (entry.dataKey === 'operating_profit') color = '#6AA5FF';

                  return (
                    <p key={entry.dataKey} style={{ margin: 0, color }}>
                      {entry.name === 'revenue'
                        ? 'Revenue'
                        : entry.name === 'operating_profit'
                          ? 'Profit'
                          : 'Profitability'}
                      :{' '}
                      {entry.name === 'profitability'
                        ? `${(entry.value as number).toFixed(2)}%`
                        : formatMoney(entry.value as number, '$', 2)}{' '}
                    </p>
                  );
                })}
              </div>
            );
          }}
          cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
        />
        <Bar
          dataKey='operating_profit'
          yAxisId='left'
          fill='url(#profitGradient)'
          radius={[4, 4, 0, 0]}
          barSize={32}
          stackId='stack'
        />
        <Bar
          dataKey='revenue'
          yAxisId='left'
          fill='url(#revenueGradient)'
          radius={[4, 4, 0, 0]}
          barSize={32}
          stackId='stack'
        />
        <Line
          dataKey='profitability'
          yAxisId='right'
          stroke='#FFA800'
          dot={{ r: 4, fill: '#FFA800' }}
          strokeWidth={2}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default HistoryofProfitDiagram;
