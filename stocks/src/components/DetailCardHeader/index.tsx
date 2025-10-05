import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import DetailsIcon from '@/assets/details-icon.svg';
import ChevronRight from '@/assets/icons/chevron-right.svg';
import PriceIndicator from '../UI/PriceIndicator';
import { formatCurrency } from '@/helpers/formatCurrency';

interface IDetailsCardHeaderProps {
  name: string;
  shortName: string;
  pathTo: string;
  img: string;
  currentPrice: number;
  priceChange: number;
  percentChange: number;
  afterPrice: string;
  className?: string;
}

const DetailsCardHeader: React.FC<IDetailsCardHeaderProps> = ({
  name,
  shortName,
  pathTo,
  img,
  currentPrice,
  priceChange,
  percentChange,
  afterPrice,
  className,
}) => {
  const isPositive = priceChange >= 0;

  return (
    <div className={clsx(className, 'flex items-start gap-x-3')}>
      <Image
        src={img}
        alt={name}
        width={50}
        height={50}
        className='rounded-full w-10 lg:w-16 h-10 lg:h-16'
      />
      <div>
        <div className='flex items-center gap-x-2'>
          <h1 className='text-[19px] lg:text-[32px] font-bold text-white'>{name}</h1>
          <span className='flex items-center justify-center p-1 bg-regaliaPurple rounded-[8px]'>
            <DetailsIcon />
          </span>
        </div>
        <div className='flex items-center gap-x-2 text-grayLight font-bold'>
          <span className='hover:text-white'>{shortName}</span>
          <ChevronRight />
          <span className='hover:text-white'>{pathTo}</span>
        </div>
        <div className='flex items-center gap-x-2'>
          <span className='text-[19px] lg:text-[32px] font-bold text-white'>
            {`${currentPrice} ${afterPrice}`}
          </span>
          <span
            className={clsx('text-[15px] font-bold', {
              'text-red': priceChange < 0,
              'text-green': priceChange >= 0,
            })}
          >
            {isPositive && '+'}
            {formatCurrency(priceChange)}
          </span>
          <PriceIndicator percentChange={percentChange} />
        </div>
      </div>
    </div>
  );
};

export default DetailsCardHeader;
