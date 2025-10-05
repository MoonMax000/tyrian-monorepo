'use client';

import type { FC } from 'react';

import ScriptCardSmart from '@/components/CARDS/ScriptCard/ScriptCardSmart';
import Reviews from '@/components/Reviews';
import ExpertCard from '@/components/CARDS/ExpertCard';
import Disclaimer from '@/components/Disclaimer';

import Breadcrumbs from '@/components/UI/Breadcrumbs';

import { ScriptTitle, Details, ScriptSlider } from './components';
import { expertMock, mockDetails, mockReviews, mockScript, mockSlides } from './constants';
import Comments from '@/components/UI/Comment';

export const ScriptCardScreen: FC<{ scriptName: string }> = ({}) => {
  return (
    <div className='w-full grow mb-[60px]'>
      <Breadcrumbs
        className='mb-8'
        withHomePage={false}
        resolvedSegments={[{ pathTo: 'scripts-tab', label: 'Scripts and Software' }]}
      />
      <div className='flex gap-x-6 w-full'>
        <div className='flex flex-col gap-y-6 grow'>
          <ScriptTitle scriptName='RiskMaster - powerful tool for traders' />
          <Details details={mockDetails} />
          <ScriptSlider slides={mockSlides} />
          <Comments />
        </div>
        <div className='flex flex-col gap-y-6 max-w-[339px]'>
          <ScriptCardSmart script={mockScript} />
          <ExpertCard expert={expertMock} />
          <Reviews reviews={mockReviews} avgAssessment={4.5} allReviewsCount={28} />
          <Disclaimer />
        </div>
      </div>
    </div>
  );
};
