import React, { FC } from 'react';
import {
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  BarChart,
  CartesianGrid,
} from 'recharts';
import { formatMoney } from '@/helpers/formatMoney';

export interface IRevenueAndNetProfitEl {
  name: string;
  netIncome: number;
  revenue: number;
}

interface IRevenueAndNetProfitDiagram {
  data: IRevenueAndNetProfitEl[];
  width?: string | number;
  height?: number;
  className?: string;
}

const RevenueAndNetProfitDiagram: FC<IRevenueAndNetProfitDiagram> = ({
  data,
  width = '100%',
  height = '100%',
  className,
}) => {
  const colorMap: Record<string, string> = {
    revenue: '#A06AFF', // основной цвет градиента revenue
    netIncome: '#FFA800', // основной цвет градиента netIncome
  };

  return (
    <ResponsiveContainer width={width} height={height} className={className}>
      <BarChart data={data} layout='vertical' barGap={4}>
        <defs>
          <linearGradient id='revenueGradient' x1='0' y1='0' x2='1' y2='0'>
            <stop offset='0%' stopColor='#181A20' />
            <stop offset='100%' stopColor='#A06AFF' />
          </linearGradient>
          <linearGradient id='netGradient' x1='0' y1='0' x2='1' y2='0'>
            <stop offset='0%' stopColor='#181A20' />
            <stop offset='100%' stopColor='#FFA800' />
          </linearGradient>
        </defs>

        <CartesianGrid horizontal={false} vertical={false} />

        <XAxis type='number' hide />
        <YAxis
          type='category'
          dataKey='name'
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: '#B0B0B0', fontWeight: 700 }}
          dx={-10}
        />

        <Tooltip
          cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div
                  style={{
                    backgroundColor: '#1f1f1f',
                    borderRadius: 8,
                    padding: '8px 12px',
                    color: '#fff',
                  }}
                >
                  <div style={{ color: '#B0B0B0', marginBottom: 4, fontWeight: 700 }}>{label}</div>

                  {payload.map((entry, index) => {
                    const labelMap: Record<string, string> = {
                      revenue: 'Revenue',
                      netIncome: 'Net Profit',
                    };

                    const value =
                      typeof entry.value === 'number'
                        ? formatMoney(entry.value, '$', 2)
                        : entry.value;

                    const name =
                      entry.dataKey != null
                        ? (labelMap[entry.dataKey.toString()] ?? entry.name)
                        : entry.name;

                    const color =
                      entry.dataKey != null ? colorMap[entry.dataKey.toString()] : entry.color;

                    return (
                      <div key={index} style={{ color, marginBottom: 2 }}>
                        {name}: {value}
                      </div>
                    );
                  })}
                </div>
              );
            }
            return null;
          }}
        />

        <Bar dataKey='revenue' fill='url(#revenueGradient)' radius={4} barSize={16}>
          <LabelList
            dataKey='revenue'
            position='insideRight'
            formatter={(value: number) => formatMoney(value, '$', 2)}
            fill='#fff'
            fontSize={15}
            fontWeight={700}
          />
        </Bar>

        <Bar dataKey='netIncome' fill='url(#netGradient)' radius={4} barSize={16}>
          <LabelList
            dataKey='netIncome'
            position='right'
            formatter={(value: number) => formatMoney(value, '$', 2)}
            fill='#fff'
            fontSize={15}
            fontWeight={700}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RevenueAndNetProfitDiagram;
