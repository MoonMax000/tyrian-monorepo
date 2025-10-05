'use client';
import { FC } from 'react';
import ContentWrapper from '@/components/UI/ContentWrapper';

import One from '@/screens/mock/1Buy.svg';
import Two from '@/screens/mock/2.svg';
import Trhee from '@/screens/mock/3.svg';
import Four from '@/screens/mock/4signals.svg';

const SignalsScreen: FC = () => {
  return (
    <div className='mt-6 mb-40'>
      <ContentWrapper>
        <One />
        <div className='flex mt-6 gap-6'>
          <div>
            <Two />
            <Trhee className='mt-6' />
          </div>
          <Four />
        </div>
      </ContentWrapper>
    </div>
  );
};

export default SignalsScreen;
