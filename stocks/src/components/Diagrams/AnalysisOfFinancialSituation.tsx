import { FC } from 'react';
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { IDebtLevel } from '@/screens/HomeScreen/components/Tabs/Review/components/FinancialStability';
import { formatMoney } from '@/helpers/formatMoney';

interface IBarDiagramProps {
  data: IDebtLevel[];
  width?: string | number;
  height?: string | number;
  className?: string;
}

const AnalysisOfFinancialSituation: FC<IBarDiagramProps> = ({
  data,
  width = '100%',
  height = '100%',
  className,
}) => {
  return (
    <ResponsiveContainer width={width} height={height} className={className}>
      <ComposedChart data={data} margin={{ left: 10, top: 25 }} barGap={8}>
        <svg>
          <defs>
            <linearGradient
              id='movement-of-funds-gradient-positive'
              x1='0%'
              y1='0%'
              x2='0%'
              y2='100%'
            >
              <stop offset='0%' stopColor='#A06AFF' />
              <stop offset='100%' stopColor='#181A20' />
            </linearGradient>
            <linearGradient
              id='movement-of-funds-gradient-negative'
              x1='0%'
              y1='100%'
              x2='0%'
              y2='0%'
            >
              <stop offset='0%' stopColor='#A06AFF' />
              <stop offset='100%' stopColor='#181A20' />
            </linearGradient>

            <linearGradient id='сash-gradient-positive' x1='0%' y1='0%' x2='0%' y2='100%'>
              <stop offset='0%' stopColor='#6AA5FF' />
              <stop offset='100%' stopColor='#181A20' />
            </linearGradient>
            <linearGradient id='сash-gradient-negative' x1='0%' y1='100%' x2='0%' y2='0%'>
              <stop offset='0%' stopColor='#6AA5FF' />
              <stop offset='100%' stopColor='#181A20' />
            </linearGradient>
          </defs>
        </svg>

        <XAxis
          dataKey='date'
          tick={{
            fontSize: '12px',
            fontWeight: 700,
            color: '#B0B0B0',
          }}
          tickFormatter={(value) => value.toUpperCase()}
          dy={8}
        />
        <YAxis
          orientation='left'
          dataKey='movementOfFunds'
          axisLine={false}
          tick={{ fontSize: '12px', fontWeight: 700, color: '#B0B0B0' }}
          tickLine={false}
          tickFormatter={(value) => formatMoney(value, '', 2)}
          dx={-20}
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

              const labelMap: Record<string, string> = {
                movementOfFunds: 'Cash Flow',
                сash: 'Cash',
              };

              return (
                <div
                  style={{
                    background: '#1f1f1f',
                    borderRadius: 10,
                    padding: '8px 12px',
                    color: '#fff',
                  }}
                >
                  <div style={{ color: '#B0B0B0', marginBottom: 4 }}>{year}</div>

                  {payload.map((entry, index) => {
                    const displayValue =
                      typeof entry.value === 'number'
                        ? formatMoney(entry.value, '$', 2)
                        : entry.value;
                    const label =
                      entry.dataKey != null
                        ? (labelMap[entry.dataKey.toString()] ?? entry.name)
                        : entry.name;

                    return (
                      <div key={`item-${index}`} style={{ color: entry.color }}>
                        {label}: {displayValue}
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
        <CartesianGrid stroke='#2E2744' strokeWidth={2} vertical={false} />

        <Bar dataKey='movementOfFunds' barSize={52} radius={[4, 4, 0, 0]} fill='#A06AFF'>
          {data.map((entry, index) => (
            <Cell
              key={`movement-${index}`}
              fill={
                entry.movementOfFunds >= 0
                  ? 'url(#movement-of-funds-gradient-positive)'
                  : 'url(#movement-of-funds-gradient-negative)'
              }
            />
          ))}
        </Bar>

        <Bar dataKey='сash' barSize={52} radius={[4, 4, 0, 0]} fill='#6AA5FF'>
          {data.map((entry, index) => (
            <Cell
              key={`cash-${index}`}
              fill={
                entry.сash >= 0 ? 'url(#сash-gradient-positive)' : 'url(#сash-gradient-negative)'
              }
            />
          ))}
        </Bar>
        <ReferenceLine y={0} stroke='#523A83' strokeWidth={2} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default AnalysisOfFinancialSituation;
