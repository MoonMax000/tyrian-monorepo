'use client';

import type { FC } from 'react';

import Paper from '@/components/UI/Paper';
import Button from '@/components/UI/Button/Button';

import BuyIcon from '@/assets/icons/BuyIcon.svg';
import DotIcon from '@/assets/icons/icon-dot.svg';

type PriceItem = {
  name: string;
  price: number;
  priceType: 'single' | 'hour' | 'month';
};

interface IPriceListProps {
  prices: PriceItem[];
}

export const PriceList: FC<IPriceListProps> = ({ prices }) => {
  return (
    <Paper className='p-4'>
      <h3 className='text-purple text-[19px] font-bold mb-4'>Price List</h3>
      <ul className={'flex flex-col gap-y-6 text-[15px] font-medium'}>
        {prices.map((item) => (
          <li key={item.name} className='flex items-center gap-x-2'>
            <span>
              <DotIcon width={16} height={16} className='text-lightPurple' />
            </span>
            <div className='flex items-center gap-x-4 grow'>
              <span>{item.name}</span>
              <span className='ml-auto'>
                {`${item.price}$`}
                {item.priceType !== 'single' && `/${item.priceType}`}
              </span>
              <Button className='items-center gap-2 font-medium max-h-[26px] px-[37px]' ghost>
                <BuyIcon width={16} height={16} />
                Add to Cart
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </Paper>
  );
};
