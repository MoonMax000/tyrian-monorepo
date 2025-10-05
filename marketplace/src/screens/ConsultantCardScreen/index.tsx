'use client';

import type { FC } from 'react';

import ExpertCard from '@/components/CARDS/ExpertCard';
import Reviews from '@/components/Reviews';
import Disclaimer from '@/components/Disclaimer';

import Breadcrumbs from '@/components/UI/Breadcrumbs';

import {
  ConsultantHeader,
  ConsultantInfo,
  PriceList,
  ProfessionalDesignations,
  Video,
} from './components';
import { expertMock, mockReviews, mockVideo } from './constants';
import Comments from '@/components/UI/Comment';

interface ConsultantCardScreenProps {
  consultantName: string;
}

export const ConsultantCardScreen: FC<ConsultantCardScreenProps> = ({}) => {
  return (
    <div className='w-full grow flex flex-col gap-y-4 mb-[60px]'>
      <Breadcrumbs
        resolvedSegments={[
          {
            pathTo: 'consultants-tab',
            label: 'Investment consultants and Analysts and Traders',
          },
          {
            pattern: ({ isLast }) => isLast,
            map: (segment) =>
              segment
                .split('-')
                .map((s) => `${s[0].toUpperCase()}${s.slice(1)}`)
                .join(' '),
          },
        ]}
        filterSegments={(segment) => segment !== 'consultants'}
        withHomePage={false}
        className='mt-8'
      />
      <ConsultantHeader
        name='Sarah Lee'
        companyName='Diversified investment strategies, llc.'
        credentials={['CPFA', 'RCF']}
        location='Chandler, AZ'
        rating={5}
        subscribers={15.054}
        tags={[
          'Investment management',
          'Owning a business',
          'Retirement planning',
          'Financial life planning',
        ]}
        verified
        servesNationwide
        description='Dedicated to providing experienced guidance on all aspects of wealth management'
        consultationText='free 20-minute introductory consultation'
      />
      <ProfessionalDesignations
        designations={[
          'Certified plan fiduciary advisor (CPFA)',
          'Registered Financial Consultant (RFC)',
        ]}
      />
      <div className='flex gap-x-6 w-full'>
        <div className='flex flex-col gap-y-6 grow'>
          <ConsultantInfo
            about='This algorithm is designed to optimize your trading decisions by analyzing market data in real time. It uses a combination of historical patterns and predictive models to identify high-probability entry and exit points. With a focus on risk management, the algorithm adjusts its strategy based on changing market conditions. Whether you’re trading manually or using automated systems, this tool provides clear, actionable signals.'
            cases={[
              'Designed a strategy for a retiree, growing their retirement savings by 15% over three years through optimized investments.',
              'Developed a financial plan for an Arizona family, reducing their tax burden by 20% and incresing their portfolio by 10% in one year',
              'Supported a tech enterpreneur, achieving an average annual portfolio of 12%.',
            ]}
            services={[
              'Financial Planning',
              'Investment Management',
              'Consulting (debt, insurance, tax)',
            ]}
            educations={[
              'Bachelor’s on France, University of Arizona, 2011',
              'CFP® Certification, 2011',
            ]}
            personal={[
              'Hobbies - hiking, running, golf, volunteering.',
              'Family - married, active in local communities.',
              'Values - honesty, transparency, client-focused approach.',
            ]}
          />
          <PriceList
            prices={[
              { name: 'Personal Consultation', price: 100, priceType: 'hour' },
              { name: 'Portfolio Review', price: 150, priceType: 'single' },
              { name: 'Investment Strategy Planning', price: 200, priceType: 'single' },
              { name: 'Monthly Advisory Support', price: 250, priceType: 'month' },
              { name: 'Financial Planning', price: 180, priceType: 'single' },
              { name: 'Custom Investment Plan', price: 220, priceType: 'single' },
            ]}
          />
          <Comments />
        </div>
        <div className='flex flex-col gap-y-6 max-w-[339px]'>
          <Video video={mockVideo} />
          <ExpertCard expert={expertMock} />
          <Reviews reviews={mockReviews} avgAssessment={4.5} allReviewsCount={28} />
          <Disclaimer />
        </div>
      </div>
    </div>
  );
};
