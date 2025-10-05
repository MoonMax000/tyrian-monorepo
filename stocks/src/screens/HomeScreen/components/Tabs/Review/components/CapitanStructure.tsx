import type { FC } from 'react';
import Image from 'next/image';
import ContentWrapper from '@/components/UI/ContentWrapper';
import QuestionIcon from '@/assets/icons/question.svg';
import CapitalStructureChart from '../mock/structure-capital.png';
import { getBrightColorFromString } from '@/helpers/getBrightColorFromString';

export const CapitalStructure: FC = () => {
  return (
    <ContentWrapper className='py-6'>
      <div className='flex gap-x-[6px] items-center pb-4 border-b-[2px] border-gunpowder px-4 '>
        <h2 className='text-[24px] text-white font-bold'>Capital Structure</h2>
        <button className='text-grayLight hover:text-white'>
          <QuestionIcon width={20} height={20} />
        </button>
      </div>
      <div className='flex items-center gap-x-14 mt-6 px-4 '>
        {/* Пока мок */}
        <Image src={CapitalStructureChart} width={496} height={208} alt='Capital Structure Chart' />
        <div className='grow'>
          <ul className='flex flex-col gap-y-4 text-[15px] font-bold'>
            <li className='flex items-center justify-between gap-x-4'>
              <div className='flex items-center gap-x-2 text-[15px] font-bold'>
                <div
                  className='size-3 rounded-full'
                  style={{ backgroundColor: getBrightColorFromString('Market Capitalization') }}
                />
                <span>Market Capitalization</span>
              </div>
              <span>$1.37Т</span>
            </li>
            <li className='flex items-center justify-between gap-x-4'>
              <div className='flex items-center gap-x-2 text-[15px] font-bold'>
                <div
                  className='size-3 rounded-full'
                  style={{ backgroundColor: getBrightColorFromString('Debt') }}
                />
                <span>Debt</span>
              </div>
              <span>$12.78B</span>
            </li>
            <li className='flex items-center justify-between gap-x-4'>
              <div className='flex items-center gap-x-2 text-[15px] font-bold'>
                <div
                  className='size-3 rounded-full'
                  style={{ backgroundColor: getBrightColorFromString('Minority Stake') }}
                />
                <span>Minority Stake</span>
              </div>
              <span>$779.00M</span>
            </li>
            <li className='flex items-center justify-between gap-x-4'>
              <div className='flex items-center gap-x-2 text-[15px] font-bold'>
                <div
                  className='size-3 rounded-full'
                  style={{ backgroundColor: getBrightColorFromString('Cash & Cash Equivalents') }}
                />
                <span>Cash & Cash Equivalents</span>
              </div>
              <span>$34.13B</span>
            </li>
            <li className='flex items-center justify-between gap-x-4 pt-3 border-t-[1px] border-t-regaliaPurple'>
              <div className='flex items-center gap-x-2 text-[15px] font-bold'>
                <div
                  className='size-3 rounded-full'
                  style={{ backgroundColor: getBrightColorFromString('Enterprise Value (EV)') }}
                />
                <span>Enterprise Value (EV)</span>
              </div>
              <span>$1.35T</span>
            </li>
          </ul>
        </div>
      </div>
    </ContentWrapper>
  );
};
