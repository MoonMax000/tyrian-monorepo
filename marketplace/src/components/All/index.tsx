'use client';

import type { FC } from 'react';
import SeeAll from '@/components/UI/SeeAll';
import SignalCard from '@/components/CARDS/SignalCard';
import RobotCard from '@/components/CARDS/RobotCard';
import PortfolioCard from '@/components/CARDS/PortfolioCard';
import ScriptCard from '@/components/CARDS/ScriptCard';
import SubCount from '@/components/UI/SubCount';
import TagLabel from '@/components/UI/TagLabel';
import IconScript from '@/assets/mock/mock-script.svg';
import IconExpert from '@/assets/mock/mock-expert.svg';
import IconOther from '@/assets/mock/mock-other.png';
import ConsultantCard from '@/components/CARDS/ConsultantCard';
import TradersCard from '../CARDS/TradersCard';
import AnalystsCard from '../CARDS/AnalystsCard';
import CourseCard from '../CARDS/CourseCard';
import OtherCard from '../CARDS/OtherCard';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Favorites: FC = () => {
  const { push } = useRouter();
  return (
    <section className='mt-16 mb-20 flex flex-col gap-20'>
      <div>
        <div className='flex justify-between items-center hover:cursor-pointer'>
          <h2 className='text-bold-31'>Traders</h2>
          <SeeAll />
        </div>
        <div className='flex mt-12 flex-wrap gap-6'>
          {Array.from({ length: 2 }).map((_, index) => (
            <TradersCard onClick={() => push('/analystys-tab/1')} key={index} />
          ))}
        </div>
      </div>
      <div>
        <div className='flex justify-between items-center hover:cursor-pointer'>
          <h2 className='text-bold-31'>Analysts</h2>
          <SeeAll />
        </div>
        <div className='flex mt-12 flex-wrap gap-6'>
          {Array.from({ length: 3 }).map((_, index) => (
            <AnalystsCard onClick={() => push('/analystys-tab/1')} key={index} />
          ))}
        </div>
      </div>
      <div>
        <div className='flex justify-between items-center hover:cursor-pointer'>
          <h2 className='text-bold-31'>Investment consultants</h2>
          <SeeAll />
        </div>
        <div className='flex mt-12 flex-wrap gap-6'>
          {Array.from({ length: 3 }).map((_, index) => (
            <ConsultantCard onClick={() => push('/consultants-tab/1')} key={index} />
          ))}
        </div>
      </div>
      <div>
        <div className='flex justify-between items-center hover:cursor-pointer'>
          <h2 className='text-bold-31'>Signals and Technical indicators</h2>
          <SeeAll />
        </div>
        <div className='flex mt-12 flex-wrap gap-6'>
          {Array.from({ length: 2 }).map((_, index) => (
            <SignalCard handleClick={() => push('/signals-tab/signals/1')} key={index} />
          ))}
        </div>
      </div>
      <div>
        <div className='flex justify-between items-center hover:cursor-pointer'>
          <h2 className='text-bold-31'>Strategies and Portfolios</h2>
          <SeeAll />
        </div>
        <div className='flex mt-12 flex-wrap gap-6'>
          {Array.from({ length: 3 }).map((_, index) => (
            <PortfolioCard onClick={() => push('/')} key={index} />
          ))}
        </div>
      </div>

      <div>
        <div className='flex justify-between items-center hover:cursor-pointer'>
          <h2 className='text-bold-31'>Courses and Training materials</h2>
          <SeeAll />
        </div>
        <div className='mt-12 flex flex-col gap-6'>
          {Array.from({ length: 1 }).map((_, i) => (
            <CourseCard onClick={() => push('/courses-tab/1')} key={i} icon={<IconExpert />} />
          ))}
        </div>
      </div>

      <div>
        <div className='flex justify-between items-center hover:cursor-pointer'>
          <h2 className='text-bold-31'>Scripts and Software</h2>
          <SeeAll />
        </div>
        <div className='mt-12 flex flex-col gap-6'>
          {Array.from({ length: 1 }).map((_, i) => (
            <ScriptCard
              onClick={() => push('/scripts-tab/1')}
              key={i}
              title='Product Name'
              icon={<IconScript />}
              iconProfile={
                <Image
                  src={'/productIcon.png'}
                  width={64}
                  height={64}
                  alt='avatar'
                  className='size-[64px] rounded-lg object-cover'
                />
              }
              action={
                <div className='flex gap-1'>
                  <SubCount personse={1748} />
                  <TagLabel value='Windows/Mac' category='some' />
                  <TagLabel value='Top Seller' category='some' />
                </div>
              }
            />
          ))}
        </div>
      </div>

      <div>
        <div className='flex justify-between items-center hover:cursor-pointer'>
          <h2 className='text-bold-31'>Trading robots and Algorithms</h2>
          <SeeAll />
        </div>
        <div className='flex mt-12 flex-wrap gap-6'>
          {Array.from({ length: 3 }).map((_, index) => (
            <RobotCard routePath='/robots-tab/robots/1' key={index} />
          ))}
        </div>
      </div>

      <div>
        <div className='flex justify-between items-center hover:cursor-pointer'>
          <h2 className='text-bold-31'>Other</h2>
          <SeeAll />
        </div>
        <div className='mt-12 flex flex-col gap-6'>
          {Array.from({ length: 1 }).map((_, i) => (
            <OtherCard
              onClick={() => push('/others-tab/1')}
              key={i}
              icon={IconOther.src}
              iconProfile={
                <Image
                  src={'/productIcon.png'}
                  width={64}
                  height={64}
                  alt='avatar'
                  className='size-[64px] rounded-lg object-cover'
                />
              }
              action={
                <div className='flex gap-1'>
                  <TagLabel value='4,8' category='good' />
                  <SubCount personse={1748} />
                  <TagLabel value='Individual Analyst' category='some' />
                </div>
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Favorites;
