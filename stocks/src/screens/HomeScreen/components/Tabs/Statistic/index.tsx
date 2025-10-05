'use client';
import Image from 'next/image';

import Block3 from './mock/Блок3.svg';
import Block4 from './mock/Блок4.svg';
import Block5 from './mock/Блок5.svg';
import Block6 from './mock/Блок6.svg';
import Block7 from './mock/Блок7.svg';
import Block8 from './mock/Блок8.svg';
import Block9 from './mock/Блок9.svg';
import Block10 from './mock/Блок10.svg';

const StatisticTab = () => {
  return (
    <section className='flex  gap-6 max-w-[702px]'>
      <div className='flex gap-12 flex-col max-w-[702px]'>
        <div className='relative'>
          <Image src='/statiticMoc/Блок.svg' alt='' width={702} height={717} />
          <div className='w-full h-full absolute top-0'></div>
        </div>
        <div className='relative'>
          <Image src='/statiticMoc/Блок2.svg' alt='' width={702} height={576} />
          <div className='w-full h-full absolute top-0'></div>
        </div>

        <Block3 />
        <Block4 />
        <Block5 />
        <Block6 />
        <Block7 />
        <Block8 />
      </div>
      <div className='flex gap-6 flex-col'>
        <Block9 />
        <Block10 />
      </div>
    </section>
  );
};

export default StatisticTab;
