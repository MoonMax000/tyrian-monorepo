import type { FC } from 'react';
import Link from 'next/link';
import Image, { type StaticImageData } from 'next/image';
import ContentWrapper from '@/components/UI/ContentWrapper';
import ChevronRight from '@/assets/icons/chevron-right.svg';
import { formatCurrency } from '@/helpers/formatCurrency';

export type TopHoldingItem = {
  id: number;
  img: string | StaticImageData;
  name: string;
  shortName: string;
  price: number;
};

interface ITopHoldingProps {
  topHolding: TopHoldingItem[];
  shortName: string;
}

export const TopHolding: FC<ITopHoldingProps> = ({ topHolding, shortName }) => (
  <ContentWrapper className='mt-6'>
    <div className='pl-6 pr-4 py-4 border-b-[1px] border-b-regaliaPurple flex items-center justify-between'>
      <h4 className='text-[19px] font-bold text-white'>Top 10 holdings</h4>
      <Link
        href={`${shortName}/holdings`}
        className='text-[15px] font-bold text-purple flex items-center gap-x-2 hover:underline'
      >
        <span>See all holdings</span>
        <ChevronRight />
      </Link>
    </div>
    <div className='grid grid-cols-1 lg:grid-cols-2 p-6 gap-x-12 gap-y-6'>
      {topHolding.map((item) => (
        <div key={item.id} className='flex items-center justify-between'>
          <div className='flex items-center gap-x-2'>
            <Image src={item.img} alt={item.name} className='rounded-full w-11 h-11' />
            <div className='flex flex-col gap-y-1 text-[15px]'>
              <span className='text-[15px] font-bold text-white'>{item.name}</span>
              <span className='font-medium text-grayLight uppercase'>{item.shortName}</span>
            </div>
          </div>
          <span className='font-bold text-white text-[15px]'>{formatCurrency(item.price)}</span>
        </div>
      ))}
    </div>
  </ContentWrapper>
);
