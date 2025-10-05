import React, { FC } from 'react';
import { PercentCard } from '@/components/PercentCard/PercentCard';
import Image from 'next/image';
import { ViewAll } from '../UI/ViewAll/ViewAll';
import { StocksBlock } from '../StocksBlock/StocksBlock';
import { StocksCard } from '../StocksCard/StocksCard';
import { StocksValues } from '@/screens/MainContent/mockData';

interface Props {
  title: string;
  content: StocksValues[];
}

export const ForexCard: FC<Props> = ({ title, content }) => {
  return (
    <div className='flex flex-col w-[742px] h-fit rounded-[24px] border border-[#523A83] backdrop-blur-[100px]'>
      <div className='flex w-full items-center pb-3 pl-4 pr-4 h-[42px] mt-4 justify-between border-b-[1px] border-regaliaPurple'>
        <span className='font-bold text-[19px] text-white'>{title}</span>
        <ViewAll children='View All' />
      </div>
      <div className='flex flex-wrap gap-6 px-6 py-5'>
        {content.map((item) => (
          <StocksCard key={item.title} item={item} className='min-w-[323px]' />
        ))}
      </div>
    </div>
  );
};
