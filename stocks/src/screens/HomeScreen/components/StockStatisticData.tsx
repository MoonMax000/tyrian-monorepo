import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { IPaperResponse, StocksService } from '@/services/StocksService';
import { useQuery } from '@tanstack/react-query';
import ContentWrapper from '@/components/UI/ContentWrapper';
import PriceIndicator from '@/components/UI/PriceIndicator';
import { formatNumberWithSymbols } from '@/helpers/formatNumberWithSymbols';
import { formatDateMonthYear } from '@/helpers/formatDayMonthYear';
import ArrowRight from '@/assets/icons/mini-arrow-right.svg';
import DetailsIcon from '@/assets/details-icon.svg';
import MoexImg from '@/assets/shares/moex.png';
import SberImg from '@/assets/shares/sber.png';
import { VolumeRangeSlider } from './VolumeRangeSlider';

interface Props {
  stockName: string;
  stockInfo?: Partial<IPaperResponse>;
}

const StockPriceChart: FC<Props> = ({ stockName, stockInfo }) => {
  const baseChangesPercent = (12.78 / (287.07 - 12.78)) * 100;

  return (
    <ContentWrapper className='p-6 grow'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex items-center gap-x-3'>
          <div className='flex items-center'>
            <Image
              src={MoexImg}
              alt='MOEX'
              width={64}
              height={64}
              className='rounded-full'
              placeholder='blur'
            />
            <Image
              src={`https://stocks-api.tyriantrade.com/api/media/company_icons/${stockName}`}
              alt={stockName}
              width={64}
              height={64}
              className='rounded-full relative z-2 right-5'
            />
          </div>
          <div className='flex flex-col'>
            <h2 className='text-white font-bold text-[24px] inline-flex items-center flex-wrap gap-x-2'>
              {stockInfo?.name ?? 'Stock'}
              <div className='p-2 rounded-lg bg-gunpowder'>
                <DetailsIcon />
              </div>
            </h2>
            <div className='flex items-center'>
              <span className='text-[15px] font-bold text-purple'>
                {stockInfo?.exchange ?? 'exchange'}
              </span>
              <ArrowRight fontSize={15} className='text-regaliaPurple' />
              <span className='text-[15px] font-bold text-grayLight'>{stockName}</span>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-x-[6px]'>
          <Image
            src='/countries/ru.png'
            alt='ru'
            width={40}
            height={40}
            className='rounded-full size-4'
          />
          <span className='text-[15px] font-bold text-white'>Russia</span>
        </div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6'>
        <div className='flex flex-col gap-y-1'>
          <span className='text-[12px] font-bold text-grayLight uppercase'>base info</span>
          <div className='flex items-center gap-x-1'>
            <span className='text-[19px] font-bold text-white'>
              {formatNumberWithSymbols({
                num: stockInfo?.price ?? 0,
                symbolAfter: '$',
                toFixed: 2,
              })}
            </span>
            <span className={clsx('text-[15px] font-bold')}>
              {formatNumberWithSymbols({
                num: 12.78,
                symbolAfter: '$',
                symbolBefore: '+',
                toFixed: 2,
              })}
            </span>
            <PriceIndicator percentChange={baseChangesPercent} />
          </div>
          <span className='text-[12px] font-bold text-grayLight uppercase'>
            At close at{' '}
            {formatDateMonthYear(new Date(), {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
              timeZoneName: 'short',
            })}
          </span>
        </div>
        <div className='flex flex-col gap-y-1'>
          <span className='text-[12px] font-bold text-grayLight uppercase'>premarket</span>
          <div className='flex items-center gap-x-1'>
            <span className='text-[19px] font-bold text-white'>
              {formatNumberWithSymbols({ num: 300, symbolAfter: '$', toFixed: 2 })}
            </span>
            <span className={clsx('text-[15px] font-bold text-green')}>
              {formatNumberWithSymbols({
                num: 300,
                symbolAfter: '$',
                symbolBefore: '+',
                toFixed: 2,
              })}
            </span>
            <PriceIndicator percentChange={baseChangesPercent} />
            <div className='p-2 rounded-lg bg-gunpowder'>
              <DetailsIcon fontSize={10} />
            </div>
          </div>
          <span className='text-[12px] font-bold text-grayLight uppercase'>
            before hours volume: 0
          </span>
        </div>
      </div>
      <VolumeRangeSlider
        value={287.07}
        min={274.3}
        max={313.3}
        volume={700}
        average={280}
        currencySymbol='$'
      />
    </ContentWrapper>
  );
};

export default StockPriceChart;
