'use client';

import type { FC } from 'react';

import RobotCardSmart from '@/components/CARDS/RobotCard/RobotCardSmart';
import ExpertCard from '@/components/CARDS/ExpertCard';
import Reviews from '@/components/Reviews';
import Disclaimer from '@/components/Disclaimer';
import BotSubscribersRaiting from '@/components/BotSubscribersRaiting';
import { PerformanceChartBlock } from '@/components/PerformanceChartBlock';
import { AccuracyChartBlock } from '@/components/AccuracyChartBlock';

import Breadcrumbs from '@/components/UI/Breadcrumbs';

import { RobotDescription, RobotTitle, Details } from './components';
import { mockRobotDescription, mockDetails, mockReviews, robotMock, expertMock } from './constants';
import Comments from '@/components/UI/Comment';

export const RobotCardsScreen: FC<{ robotName: string }> = ({ robotName }) => {
  return (
    <div className='w-full grow mb-[60px]'>
      <Breadcrumbs
        className='mb-8'
        withHomePage={false}
        filterSegments={(segment) => segment !== 'robots'}
        resolvedSegments={[{ pathTo: 'robots-tab', label: 'Trading robots and Algorithms' }]}
      />
      <RobotTitle robotName='BTC/USDT Grid-Bot HODL' />
      <div className='flex gap-x-6 w-full'>
        <div className='flex flex-col gap-y-6 grow'>
          <RobotDescription {...mockRobotDescription} />
          <Details details={mockDetails} />
          <PerformanceChartBlock title='Performance' />
          <AccuracyChartBlock title='Accuracy' />
          <BotSubscribersRaiting />
          <Comments />
        </div>
        <div className='flex flex-col gap-y-6 max-w-[339px]'>
          <RobotCardSmart robot={{ ...robotMock, robotName }} />
          <ExpertCard expert={expertMock} />
          <Reviews avgAssessment={4.5} reviews={mockReviews} allReviewsCount={28} />
          <Disclaimer />
        </div>
      </div>
    </div>
  );
};
