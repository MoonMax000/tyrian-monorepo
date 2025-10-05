'use client';

import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import Image from '../Image';
import PriceIndicator from '../PriceIndicator';
import { formatCurrency } from '@/helpers/formatCurrency';
import ChevronRight from '@/assets/icons/chevron-right.svg';
import Eye from '@/assets/icons/eyes/icon-list-eye.svg';
import Clock from '@/assets/icons/clock.svg';
import Hot from '@/assets/icons/hot.svg';
import { useRouter } from 'next/navigation';
import Skeleton from '../Skeleton';

export interface PopularListItem {
  img?: string;
  name: string;
  price: number;
  profit: number;
  shortName?: string;
}

interface PopularListProps {
  items: PopularListItem[];
  link: string;
  title: string;
  className?: string;
  isLoading?: boolean;
}

const PopularList: React.FC<PopularListProps> = ({ items, link, title, className, isLoading }) => {
  const { push } = useRouter();
  return (
    <div className={clsx('rounded-[24px] border-[1px] border-regaliaPurple p-4', className)}>
      <div className='flex items-center justify-between gap-x-2 mb-4'>
        <Link href={link} className='flex items-center gap-x-2 hover:underline'>
          <span className='text-[19px] font-bold text-white'>{title}</span>
          <ChevronRight />
        </Link>
        <div className='flex items-center justify-center gap-x-2'>
          {[Hot, Clock, Eye].map((Icon, i) => (
            <button
              key={i}
              className={clsx(
                'flex items-center h-[26px] w-[26px] justify-center p-1 rounded-[4px]',
                {
                  'bg-regaliaPurple': i === 0,
                  'border-[1px] border-regaliaPurple': i !== 0,
                },
              )}
            >
              <Icon className='w-full h-full' />
            </button>
          ))}
        </div>
      </div>
      <ul className='flex flex-col gap-y-[23px]'>
        {isLoading &&
          [...new Array(5).fill(null)].map((_, i) => (
            <li
              key={i}
              className='grid grid-cols-[200px,100px,80px] items-center gap-x-4 md:gap-x-[30px] text-white font-bold'
            >
              <div className='flex items-center gap-x-2'>
                <Skeleton className='w-6 h-6 !rounded-full' />
                <Skeleton className='w-[140px] h-2' />
              </div>
              <Skeleton className='w-14 h-2 justify-self-end' />
              <Skeleton className='w-14 h-2 justify-self-end' />
            </li>
          ))}

        {items.map(({ img, name, price, profit, shortName }) => (
          <li
            key={name}
            className='grid grid-cols-[200px,100px,auto] items-center gap-x-4 md:gap-x-[30px] text-white font-bold cursor-pointer'
            onClick={() => push(`/stock/${shortName}`)}
          >
            <div className='flex items-center gap-x-2 overflow-hidden'>
              {img && (
                <Image src={img} alt={name} className='rounded-full' width={24} height={24} />
              )}
              <span className='truncate block'>{name}</span>
            </div>

            <span className='text-[15px] justify-self-end'>{formatCurrency(price)}</span>
            <div className='flex items-center justify-end'>
              <PriceIndicator percentChange={profit} className='w-fit' />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PopularList;
