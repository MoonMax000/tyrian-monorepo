import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { IFinanceIndicatorEl } from './constants';
import { renderColorfulLegendText, tickFormatter } from './helper';
import { FC } from 'react';
import { formatCurrency } from '@/helpers/formatCurrency';

interface IBarDiagramProps {
  data: IFinanceIndicatorEl[];
  wiidth?: string;
  height?: number;
  className?: string;
}

const BarDiagramWidthLines: FC<IBarDiagramProps> = ({
  data,
  wiidth = '100%',
  height = '100%',
  className,
}) => {
  return (
    <ResponsiveContainer width={wiidth} height={height} className={className}>
      <ComposedChart data={data} margin={{ top: 28 }} barGap={10}>
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
          axisLine={false}
          dataKey='date'
          tick={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF' }}
          dy={8}
          padding={{ left: 50, right: 40 }}
        />
        <YAxis
          dy={-12}
          mirror={true}
          yAxisId={'left_indicator'}
          orientation='left'
          dataKey='left_indicator'
          axisLine={false}
          tick={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF' }}
          tickLine={false}
          tickFormatter={tickFormatter}
        />
        <YAxis
          dy={-12}
          mirror={true}
          orientation='right'
          dataKey='right_indicator'
          axisLine={false}
          tick={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF' }}
          tickLine={false}
          tickFormatter={tickFormatter}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload || payload.length === 0) return null;

            const colorMap: Record<string, string> = {
              left_indicator: '#A06AFF',
              operating_profit: '#6AA5FF',
              revenue: '#FFA800',
            };

            return (
              <div className='bg-[#1f1f1f] p-2 rounded-[4px] flex flex-col gap-1 min-w-[200px]'>
                <div className='text-[#B0B0B0] text-[15px] font-medium'>{label}</div>
                {payload.map((entry) => {
                  const key = entry.dataKey?.toString() ?? '';
                  return (
                    <div key={key} className='flex justify-between items-center'>
                      <span className='font-medium' style={{ color: colorMap[key] }}>
                        {entry.name}:
                      </span>{' '}
                      <span className='font-medium' style={{ color: colorMap[key] }}>
                        {typeof entry?.value === 'number'
                          ? formatCurrency(entry?.value ?? 0)
                          : entry.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          }}
          cursor={{
            stroke: '#A06AFF7A',
            strokeWidth: 1,
            strokeDasharray: '2 2',
            fill: 'transparent',
          }}
        />
        <Legend iconSize={0} formatter={renderColorfulLegendText} />
        <CartesianGrid stroke='#ffffff0d' vertical={false} />
        <Bar dataKey='left_indicator' barSize={48} fill='#A06AFF' radius={4}>
          {data.map((entry, index) => (
            <Cell
              key={`movement-${index}`}
              fill={
                entry.left_indicator >= 0
                  ? 'url(#movement-of-funds-gradient-positive)'
                  : 'url(#movement-of-funds-gradient-negative)'
              }
            />
          ))}
        </Bar>
        <Line
          type='monotone'
          dataKey='operating_profit'
          stroke='#6AA5FF'
          dot={false}
          strokeWidth={2}
        />
        <Line type='monotone' dataKey='revenue' stroke='#FFA800' dot={false} strokeWidth={2} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default BarDiagramWidthLines;
