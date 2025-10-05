'use client';

import type { FC } from 'react';

import CourseCardSmart from '@/components/CARDS/CourseCard/CourseCardSmart';
import Reviews from '@/components/Reviews';
import ExpertCard from '@/components/CARDS/ExpertCard';
import Disclaimer from '@/components/Disclaimer';

import Breadcrumbs from '@/components/UI/Breadcrumbs';
import Paper from '@/components/UI/Paper';
import Slider from '@/components/UI/Slider';

import { CourseInfo, CourseTitle } from './components';
import { expertMock, mockCourse, mockReviews, mockSlides } from './constants';
import Comments from '@/components/UI/Comment';

export const CourseCardScreen: FC<{ courseName: string }> = ({}) => {
  return (
    <div className='w-full grow mb-[60px]'>
      <Breadcrumbs
        className='mb-8'
        withHomePage={false}
        resolvedSegments={[{ pathTo: 'courses-tab', label: 'Courses and Training materials' }]}
      />
      <CourseTitle courseName='P2P Crypto Arbitrage from Scratch! Author’s training program.' />
      <div className='flex gap-x-6 w-full'>
        <div className='flex flex-col gap-y-6 grow'>
          <Paper className='p-4 w-full'>
            <Slider
              showDots={false}
              className='w-[680px] h-[357px]'
              showCount={false}
              slides={mockSlides}
            />
          </Paper>
          <CourseInfo />
          <Comments />
        </div>
        <div className='flex flex-col gap-y-6 max-w-[339px]'>
          <CourseCardSmart course={mockCourse as any} />
          <ExpertCard expert={expertMock} />
          <Reviews reviews={mockReviews} avgAssessment={4.5} allReviewsCount={28} />
          <Disclaimer />
        </div>
      </div>
    </div>
  );
};
