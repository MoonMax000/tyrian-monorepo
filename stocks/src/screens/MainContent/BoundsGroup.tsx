import { PercentCard } from '@/components/PercentCard/PercentCard';
import { StocksBlock } from '@/components/StocksBlock/StocksBlock';
import React, { FC } from 'react';
import { StocksValues, stocksValues } from './mockData';

interface Props {
  title?: string;
  values?: StocksValues[];
  onClick?: () => void;
  onClickItem?: () => void;
}

export const BoundsGroup: FC<Props> = ({ title, values, onClick, onClickItem }) => {
  return (
    <div className='flex gap-2 min-h-full'>
      <div className='flex flex-col w-[247px] rounded-2xl border border-regaliaPurple bg-transparent backdrop-blur-[100px] p-4'>
        <span className='text-[19px] font-bold'>Government Bond Yields</span>
        <div className='flex flex-col'>
          <span className='text-[31px] font-bold'>$564.34</span>
          <div className='flex gap-2'>
            <PercentCard className='bg-darkRed' classNameText='text-red' />
            <PercentCard className='bg-darkRed' classNameText='text-red' />
          </div>
          <span className='text-[15px] font-medium text-textGray mt-2'>
            At close at 04:59 GMT +5
          </span>
        </div>
      </div>
      <StocksBlock
        onClick={onClick}
        content={values ?? stocksValues}
        title={title ?? 'Treasury Bonds'}
      />
    </div>
  );
};
