'use client';

import clsx from 'clsx';
import { FC } from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
  Line,
} from 'recharts';

export interface ComposedDiagramDataItem {
  year: number;
  percent: number;
  [key: `price_${number}`]: number;
}

interface ComposedDiagramProps {
  data: ComposedDiagramDataItem[];
  width?: string | number;
  height?: string | number;
  className?: string;
}

const ComposedDiagramWithFiveBlockInBar: FC<ComposedDiagramProps> = ({
  data,
  className,
  height = 400,
  width = '100%',
}) => {
  return (
    <ResponsiveContainer width={width} height={height} className={className}>
      <ComposedChart data={data} margin={{ top: 20 }} barGap={2} barCategoryGap={2}>
        <svg>
          <defs>
            <linearGradient
              id='movement-of-funds-gradient-positive_1'
              x1='0%'
              y1='0%'
              x2='0%'
              y2='100%'
            >
              <stop offset='0%' stopColor='#A06AFF' />
              <stop offset='100%' stopColor='#181A20' />
            </linearGradient>
          </defs>
        </svg>
        <CartesianGrid vertical={false} stroke='#523A83' />
        <XAxis
          dataKey='year'
          axisLine={{ stroke: '#523A83', strokeWidth: 2 }}
          tick={{ fontSize: '12px', fontWeight: 700, fill: '#B0B0B0' }}
          dy={8}
          padding={{ left: 50, right: 50 }}
        />
        <YAxis
          dy={-12}
          mirror={true}
          yAxisId='prices'
          dataKey='price_5'
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: '12px', fontWeight: 700, fill: '#B0B0B0' }}
        />

        <YAxis
          dy={-12}
          mirror={true}
          orientation='right'
          axisLine={false}
          dataKey='percent'
          tickLine={false}
          tick={{ fontSize: '12px', fontWeight: 700, fill: '#B0B0B0' }}
          tickFormatter={(value) => `${value}%`}
        />

        {/* Генерация баров для каждой цены */}
        {data.map((item) => {
          const prices = Object.keys(item).filter((key) => key.startsWith('price'));

          return prices.map((key, index) => {
            return (
              <Bar
                key={key}
                dataKey={key}
                stackId='a'
                fill={clsx(
                  prices.length - 1 === index
                    ? 'transparent'
                    : {
                        '#A06AFF': index === 0,
                        '#A06AFFBF': index === 1,
                        '#A06AFF80': index === 2,
                        '#A06AFF40': index >= 3,
                      },
                )}
                fillOpacity={0.3}
                barSize={48}
                radius={4}
                isAnimationActive={false}
                offset={index % 2 === 0 ? 10 : 0}
              >
                <LabelList
                  dataKey={key}
                  position={prices.length - 1 === index ? 'bottom' : 'center'}
                  formatter={(value: number) => value.toFixed(2)}
                  style={{ fontSize: 14, fill: '#FFF', fontWeight: 300 }}
                  offset={-30}
                />
              </Bar>
            );
          });
        })}

        <Line type='monotone' dataKey='percent' stroke='#FFA800' strokeWidth={2} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default ComposedDiagramWithFiveBlockInBar;
