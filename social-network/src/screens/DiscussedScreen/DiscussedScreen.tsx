'use client';

import React from 'react';
import IconNoContent from '@/assets/icons/icon-no-content.svg';
import { useAppSelector } from '@/store/hooks';
import RecommendedList from '@/components/Recommended/RecommendedList';
import { recommendedData } from '@/components/Recommended/constatnts';

const DiscussedScreen = () => {
  const { searchString } = useAppSelector((state) => state.search);

  return (
    <section className='flex items-start gap-6'>
      <div className='flex flex-col gap-6 w-full pb-12'>
        {searchString && (
          <div>
            <p className='text-[15px] font-semibold'>
              Main <span className='opacity-50'>/ Discussed</span>
            </p>
            <p className='text-[40px] text-center overflow-hidden leading-[48px] max-w-[712px] break-words'>
              Search results for the query ”{searchString}”
            </p>
          </div>
        )}

        <div className='flex flex-col m-auto gap-2 mt-6 items-center opacity-50 min-w-[712px]'>
          <IconNoContent className='w-10 h-10' />
          <span>Nothing new yet...</span>
        </div>
      </div>
      <RecommendedList RecommendedList={recommendedData} />
    </section>
  );
};

export default DiscussedScreen;
