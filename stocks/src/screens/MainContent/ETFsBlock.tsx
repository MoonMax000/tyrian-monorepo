import { MiniCard } from '@/components/MiniCard/MiniCard';
import { ViewAll } from '@/components/UI/ViewAll/ViewAll';
import React, { FC } from 'react';

interface Props {
  title: string;
  content?: number[];
}

export const ETFsBlock: FC<Props> = ({ title, content = [0, 1, 2, 3, 4, 5] }) => {
  return (
    <div className='flex flex-col justify-between h-[340px] w-[750px]'>
      <div className='flex justify-between'>
        <span className='font-bold text-[24px]'>{title}</span>
        <ViewAll children='View All' className='underline' />
      </div>
      <div className='flex flex-wrap gap-2'>{content?.map((item) => <MiniCard key={item} />)}</div>
    </div>
  );
};
