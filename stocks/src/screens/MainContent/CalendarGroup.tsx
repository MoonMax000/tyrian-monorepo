import { ViewAll } from '@/components/UI/ViewAll/ViewAll';
import Image from 'next/image';
import { FC } from 'react';

interface Props {
  title: string;
}

export const CalendarGroup: FC<Props> = ({ title }) => {
  return (
    <div className='flex flex-col w-full max-w-[1509px]'>
      <div className='flex justify-between'>
        <h2 className='font-bold text-[24px]'>{title}</h2>
        <ViewAll children='View All' className='underline' />
      </div>
      <div className='flex gap-6 mt-6'>
        {Array.from([0, 1, 2, 3], () => (
          <div
            key={Math.random()}
            className='relative w-[359px] h-[359px] rounded-[24px] overflow-hidden'
          >
            <Image className='absolute' src='/Rectangle.png' width={359} height={359} alt='image' />

            <div className='relative flex flex-col justify-end z-10 w-full h-full p-6 '>
              <span className='text-[15px] font-medium'>January 31, 5:10 PM</span>
              <span className='text-[31px] font-bold'>
                Fed Meeting: Interest Rate Decision Looms Large
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
