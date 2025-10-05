import type { FC } from 'react';
import Image from 'next/image';
import ContentWrapper from '@/components/UI/ContentWrapper';
import { formatDateMonthYear } from '@/helpers/formatDayMonthYear';
import { formatNumberWithSymbols } from '@/helpers/formatNumberWithSymbols';
import worldMap from '@/assets/world-mapV2.png';

export type LocationItem = {
  id: number;
  name: string;
  percent: number;
};

interface ILocationListProps {
  analysisDate: string;
  locations: LocationItem[];
  className?: string;
}

export const LocationList: FC<ILocationListProps> = ({ locations, analysisDate, className }) => (
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
          <Image src={worldMap} alt='explosure type' className='max-w-full object-cover' />
        </div>
        <div className='text-white'>
          <ul className='text-[15px] font-medium'>
            {locations.map(({ id, name, percent }) => (
              <li
                key={id}
                className='flex items-center gap-x-3 py-3 border-b-[1px] last:border-none border-[#4A4A6E]'
              >
                <span className='w-3 h-3 rounded-full bg-[#474747]' />
                <span>{name}</span>
                <span className='ml-auto'>
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
