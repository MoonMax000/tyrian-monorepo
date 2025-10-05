import clsx from 'clsx';
import { FC } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface AccuracyChart {
  name: string;
  UNSUCCESSFUL: number;
  SUCCESSFUL: number;
  amt: number;
}
interface Props {
  className?: string;
  data?: AccuracyChart[];
}

export const SimpleBarChart: FC<Props> = ({ className, data }) => {
  return (
    <ResponsiveContainer width='100%' className={clsx('max-h-[400px]', className)} height='100%'>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid verticalPoints={[0]} stroke='#2E2744' />
        <XAxis dataKey='name' />
        <YAxis
          orientation='right'
          width={20}
          tickLine={false}
          tick={{ fontSize: '12px', fontWeight: 700, fill: '#B0B0B0' }}
          axisLine={false}
        />
        <Tooltip />
        <Legend
          iconType='circle'
          formatter={(value) => <span style={{ color: '#808283', fontSize: '12px' }}>{value}</span>}
        />
        <Bar dataKey='SUCCESSFUL' fill='url(#barGradient)' radius={[24, 24, 0, 0]}></Bar>
        <defs>
          <defs>
            <linearGradient id='barGradient1' x1='0' y1='1' x2='0' y2='0'>
              <stop offset='0%' stopColor='#181A20' />
              <stop offset='100%' stopColor='#FFA800' />
            </linearGradient>
          </defs>
          <linearGradient id='barGradient' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor='#A06AFF' />
            <stop offset='100%' stopColor='#181A20' />
          </linearGradient>
        </defs>

        <Bar
          radius={[24, 24, 0, 0]}
          dataKey='UNSUCCESSFUL'
          fill='url(#barGradient1)'
          activeBar={<Rectangle fill='gold' stroke='purple' />}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
