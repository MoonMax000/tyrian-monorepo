'use client';

import type { FC } from 'react';

import OtherCardSmart from '@/components/CARDS/OtherCard/OtherCardSmart';
import Reviews from '@/components/Reviews';
import ExpertCard from '@/components/CARDS/ExpertCard';
import Disclaimer from '@/components/Disclaimer';

import Breadcrumbs from '@/components/UI/Breadcrumbs';

import { expertMock, mockReviews, mockOther, mockDetails, mockSlides } from './constants';
import { Description, OtherTitle, Details, OtherSlider } from './components';
import Comments from '@/components/UI/Comment';

export const OtherCardScreen: FC<{ otherName: string }> = ({}) => {
  return (
    <div className='w-full grow mb-[60px]'>
      <Breadcrumbs
        className='mb-8'
        withHomePage={false}
        resolvedSegments={[{ pathTo: 'others-tab', label: 'Scripts and Software' }]}
      />
      <OtherTitle otherName='Auto Script - Automation script' />
      <div className='flex gap-x-6 w-full'>
        <div className='flex flex-col gap-y-6 grow'>
          <OtherSlider slides={mockSlides} />
          <Details details={mockDetails} />
          <Description />
          <Comments />
        </div>
        <div className='flex flex-col gap-y-6 max-w-[339px]'>
          <OtherCardSmart other={mockOther} />
          <ExpertCard expert={expertMock} />
          <Reviews reviews={mockReviews} avgAssessment={4.5} allReviewsCount={28} />
          <Disclaimer />
        </div>
      </div>
    </div>
  );
};
