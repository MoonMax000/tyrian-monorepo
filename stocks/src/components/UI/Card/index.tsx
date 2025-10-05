'use client';

import React from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import clsx from 'clsx';
import PriceIndicator from '../PriceIndicator';

export interface CardData {
  date: string;
  price: number;
}

interface CardProps {
  data: CardData[];
  title: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ data, title, className }) => {
  const percentChange = ((data[data.length - 1].price - data[0].price) / data[0].price) * 100;
  const currentPrice = data[data.length - 1].price;

  return (
    <div
      className={clsx(
        'flex flex-col rounded-[24px] border-[1px] border-purple bg-gradient-to-br from-[#0f0f0f] to-[#181A20] text-white w-full shadow-lg',
        className,
      )}
    >
      <div className='p-4'>
        <h3 className='text-[15px] font-bold mb-2'>{title}</h3>
        <p className='text-[15px] font-bold mb-1'>${currentPrice}</p>
        <PriceIndicator percentChange={percentChange} />
      </div>
      <div className='grow'>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart data={data}>
            <defs>
              <linearGradient id='chartGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#A06AFF' stopOpacity={0.4} />
                <stop offset='100%' stopColor='#A06AFF' stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey='date' hide />
            <YAxis hide />
            <Area
              type='monotone'
              dataKey='price'
              stroke='#A06AFF'
              strokeWidth={2}
              fill='url(#chartGradient)'
              dot={false}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Card;
