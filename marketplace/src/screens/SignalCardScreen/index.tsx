'use client';

import type { FC } from 'react';
import Image from 'next/image';

import IndicatorCardSmart from '@/components/CARDS/IndicatorCard/IndicatorCardSmart';
import ExpertCard from '@/components/CARDS/ExpertCard';
import Reviews from '@/components/Reviews';
import Disclaimer from '@/components/Disclaimer';
import { PerformanceChartBlock } from '@/components/PerformanceChartBlock';

import Paper from '@/components/UI/Paper';
import Comments from '@/components/UI/Comment';
import Breadcrumbs from '@/components/UI/Breadcrumbs';
import StarIcon from '@/assets/icons/icon-star.svg';

import { Description, Specifications } from './components';
import { Slider } from '@/components/UI/Slider/Slider';
import Button from '@/components/UI/Button/Button';
import {
  mockSpecifications,
  mockReviews,
  indicatorMock,
  expertMock,
  mockSlides,
} from './constants';
import { AccuracyChartBlock } from '@/components/AccuracyChartBlock';

export const SignalCardScreen: FC<{ signalName: string }> = ({}) => {
  return (
    <div className='w-full grow mb-[60px]'>
      <Breadcrumbs
        className='mb-8'
        withHomePage={false}
        resolvedSegments={[{ pathTo: 'signals-tab', label: 'Signals and Technical indications' }]}
        filterSegments={(segment) => segment !== 'signals'}
      />
      <div className='flex gap-3 mb-5'>
        <Button variant='primary' className='h-[26px] text-[15px]'>
          Chart
        </Button>
        <Button className='border bg-transparent border-[#523A83] h-[26px] text-[15px]'>
          Source code
        </Button>
      </div>
      <div className='flex gap-x-6 '>
        <div className='flex flex-col gap-y-6 grow'>
          <Paper className='flex w-full h-auto rounded-[16px] p-4 gap-4 flex-col bg-blackedGray'>
            <div className='flex justify-between items-center'>
              <h1 className='font-bold text-[31px]'>
                Momentum Breakout: Signals with 65% accuracy
              </h1>
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
          <PerformanceChartBlock title='Performance' />
          <AccuracyChartBlock title='Accuracy' />

          <Description description='Catches breakouts on M5–D1 for crypto, stocks, and forex. Suitable for accounts starting from $500.' />
          <Specifications specifications={mockSpecifications} />
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
