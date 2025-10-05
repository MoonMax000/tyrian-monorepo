'use client';

import ContentWrapper from '@/components/UI/ContentWrapper';
import { holderColors } from './constants';

import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { StocksService } from '@/services/StocksService';
import { useMemo } from 'react';
import Loaders from '@/components/UI/Skeleton';
import QuestionIcon from '@/assets/icons/question.svg';
import LiquidationBtcRadarChart, {
  DataPoint,
} from '@/components/Diagrams/LiquidationBtcRadarChart';
import { shareholdersStructureMock } from './constants';

const ShareholderStructure = () => {
  const pathname = usePathname();
  const ticker = pathname.split('/').pop() || '';

  const { data, isLoading, error } = useQuery({
    queryKey: ['holdersTop', ticker],
    queryFn: () => StocksService.holdersTop('us', ticker),
    staleTime: 60000,
    enabled: !!ticker,
  });

  const transformedData = useMemo<DataPoint[]>(() => {
    if (!data?.data) {
      return shareholdersStructureMock
        .map((item, index) => ({
          color: holderColors[index] || holderColors[0],
          category: item.holder,
          value: item.shares,
        }))
        .reverse();
    }

    return data.data
      .map((item, index) => ({
        color: holderColors[index] || holderColors[0],
        category: item.holder,
        value: item.shares,
      }))
      .reverse();
  }, [data?.data]);

  return (
    <>
      {isLoading ? (
        <Loaders className='w-full h-[417px]' />
      ) : (
        <ContentWrapper className='!py-6 !px-4'>
          <div className='flex gap-x-[6px] items-center'>
            <h2 className='text-[24px] text-white font-bold'>Shareholder Structure</h2>
            <button className='text-grayLight hover:text-white'>
              <QuestionIcon width={20} height={20} />
            </button>
          </div>

          {false ? (
            <div className='h-[293px] w-full rounded-lg mt-6 opacity-40 text-white'>
              {error?.message}
            </div>
          ) : transformedData?.length === 0 ? (
            <div className='h-[293px] w-full rounded-lg mt-6 opacity-40 text-white flex items-center justify-center'>
              NO DATA
            </div>
          ) : (
            <div className='flex gap-6 items-center justify-center h-full'>
              <LiquidationBtcRadarChart
                r1={90}
                r2={50}
                data={transformedData}
                className='flex gap-y-16 w-[261px] h-[243px]'
              />

              <div>
                <p className='text-[12px] text-grayLight uppercase'>Top 5</p>
                <ul className='flex flex-col gap-3'>
                  {transformedData.map((item, index) => (
                    <li key={`${item.value}-${index}`} className='flex items-center gap-3'>
                      <span
                        style={{ backgroundColor: item.color }}
                        className='size-3 min-w-3 min-h-3 block rounded-[50%]'
                      />
                      <p className='text-body-15 font-bold'>{item.category}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </ContentWrapper>
      )}
    </>
  );
};

export default ShareholderStructure;
