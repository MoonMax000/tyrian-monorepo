'use client';

import type { FC } from 'react';
import Image from 'next/image';

import IndicatorCardSmart from '@/components/CARDS/IndicatorCard/IndicatorCardSmart';
import ExpertCard from '@/components/CARDS/ExpertCard';
import Reviews from '@/components/Reviews';
import Disclaimer from '@/components/Disclaimer';

import Paper from '@/components/UI/Paper';
import Breadcrumbs from '@/components/UI/Breadcrumbs';
import StarIcon from '@/assets/icons/icon-star.svg';

import { IndicatorInfo } from './components';
import { mockReviews, indicatorMock, expertMock } from './constants';
import { Slide, Slider } from '@/components/UI/Slider/Slider';
import Comments from '@/components/UI/Comment';

export const mockSlides = [
  {
    id: 0,
    content: (
      <div className='text-center w-full h-full bg-[url(/background/nvidia.png)] bg-cover rounded-2xl'></div>
    ),
    background: 'bg-gradient-to-r from-blue-500 to-teal-400',
  },
  {
    id: 1,
    content: (
      <div className='text-center w-full h-full bg-[url(/background/slide2.png)] bg-cover rounded-2xl'></div>
    ),
    background: 'bg-gradient-to-r from-blue-500 to-teal-400',
  },
] satisfies Slide[];

export const IndicatorCardScreen: FC<{ indicatorName: string }> = ({}) => {
  return (
    <div className='w-full grow mb-[60px]'>
      <Breadcrumbs
        className='mb-8'
        withHomePage={false}
        resolvedSegments={[{ pathTo: 'signals-tab', label: 'Signals and Technical indications' }]}
        filterSegments={(segment) => segment !== 'indicators'}
      />
      <div className='flex gap-x-6'>
        <div className='flex flex-col gap-y-6 grow'>
          <Paper className='flex w-full rounded-[16px] p-4 gap-4 flex-col bg-blackedGray'>
            <div className='w-full flex justify-between items-center'>
              <span className='text-[31px] font-bold'>
                Momentum Breakout: Signals with 65% accuracy
              </span>
              <button className='text-lighterAluminum hover:text-white focus:text-white'>
                <StarIcon width={24} height={24} fill='none' />
              </button>
            </div>
            <Slider
              showDots={false}
              className='w-[680px] h-[357px]'
              showCount={false}
              slides={mockSlides}
            />
            <div className='flex justify-between'>
              <div className='w-full max-w-full h-[20px] flex gap-[24px] '>
                <div className='flex gap-[6px] text-[#B0B0B0] text-body-12 items-center'>
                  <Image width={20} height={20} src='/icons/addPicture.svg' alt='add' />
                  USE ON CHART
                </div>
                <div className='flex gap-[6px] text-[#B0B0B0] text-body-12 items-center'>
                  <Image width={20} height={20} src='/icons/partners.svg' alt='partners' />
                  311
                </div>
                <div className='flex gap-[6px] text-[#B0B0B0] text-body-12 items-center'>
                  <Image width={20} height={20} src='/icons/comm.svg' alt='comments' />
                  87
                </div>
              </div>
              <div className='flex gap-[6px] items-center'>
                <Image src='/icons/eye.svg' width={20} height={20} alt='eye'></Image>
                <span className='font-extrabold text-[12px] text-[#B0B0B0]'>11,299</span>
              </div>
            </div>
          </Paper>
          <IndicatorInfo />
          <Comments />
        </div>
        <div className='flex flex-col gap-y-6 max-w-[339px]'>
          <IndicatorCardSmart indicator={indicatorMock} />
          <ExpertCard expert={expertMock} />
          <Reviews reviews={mockReviews} avgAssessment={4.5} allReviewsCount={28} />
          <Disclaimer />
        </div>
      </div>
    </div>
  );
};
