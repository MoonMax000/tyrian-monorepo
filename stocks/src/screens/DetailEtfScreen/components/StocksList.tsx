import type { FC } from 'react';
import Image from 'next/image';
import ContentWrapper from '@/components/UI/ContentWrapper';
import { formatDateMonthYear } from '@/helpers/formatDayMonthYear';
import { formatNumberWithSymbols } from '@/helpers/formatNumberWithSymbols';
import exposureType from '@/assets/explosure.png';

export type StockItem = {
  id: number;
  name: string;
  percent: number;
};

interface IStocksListProps {
  analysisDate: string;
  stocks: StockItem[];
  className?: string;
}

export const StockList: FC<IStocksListProps> = ({ stocks, analysisDate, className }) => (
  <ContentWrapper className={className}>
    <div className='pt-6 px-4 pb-4 border-b-[1px] border-b-regaliaPurple'>
      <h2 className='text-[24px] font-bold text-white'>What's in the fund</h2>
    </div>
    <div className='pt-6 px-4 pb-4'>
      <h3 className='text-[24px] font-bold text-white'>
        As of {formatDateMonthYear(analysisDate)}
      </h3>
      <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-3'>
        <div className='flex justify-center items-start'>
          <Image src={exposureType} alt='explosure type' className='max-w-full object-cover' />
        </div>
        <div className='text-white'>
          <div className='flex items-center justify-between text-[15px] font-bold pb-3 border-b-[1px] border-[#4A4A6E]'>
            <h4>Stocks</h4>
            <span>
              {formatNumberWithSymbols({
                num: 100,
                symbolAfter: '%',
                toFixed: 2,
              })}
            </span>
          </div>
          <ul className='text-[15px] font-medium'>
            {stocks.map(({ id, name, percent }) => (
              <li
                key={id}
                className='flex items-center justify-between gap-x-2 py-3 border-b-[1px] last:border-none border-[#4A4A6E]'
              >
                <span>{name}</span>
                <span>
                  {formatNumberWithSymbols({
                    num: percent,
                    symbolAfter: '%',
                    toFixed: 2,
                  })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </ContentWrapper>
);
