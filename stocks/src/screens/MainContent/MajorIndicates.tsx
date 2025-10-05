import { GradientGraphButton } from '@/components/GradientGraphButton/GradientGraphButton';
import React from 'react';
import Image from 'next/image';
import { periods } from './mockData';
import IconLeft from '@/assets/arrow-left.svg';
import IconRight from '@/assets/arrow-right.svg';
import { IndexCard } from '@/components/IndexCard/IndexCard';

export const MajorIndicates = () => {
  return (
    <div className='w-fit'>
      <h1 className='text-[24px] ml-10 font-bold  mb-5'>Major Indicates</h1>
      <div
        className='mx-auto w-full max-w-[1509px] h-[585px] rounded-[24px] border border-regaliaPurple px-2 py-4 backdrop-blur-[100px]'
        style={{
          boxSizing: 'border-box',
        }}
      >
        <div className='w-full flex justify-end gap-2'>
          {periods.map((period) => (
            <GradientGraphButton key={period} children={period} />
          ))}
        </div>
        <Image className='mt-3' alt='graph' src='/mainGraph.png' width={1480} height={386} />
        <div className='flex items-center justify-between border-t-[1px] mt-4 border-regaliaPurple h-[120px] p-4'>
          <div className='flex justify-center items-center rounded-full border-[1px] border-purple w-11 h-11 bg-blackedGray'>
            <IconLeft />
          </div>
          <div className='flex gap-6'>
            {Array.from([0, 1, 2, 3], () => (
              <IndexCard key={Math.random()} />
            ))}
          </div>
          <div className='flex justify-center items-center rounded-full border-[1px] border-purple w-11 h-11 bg-blackedGray'>
            <IconRight />
          </div>
        </div>
      </div>
    </div>
  );
};
