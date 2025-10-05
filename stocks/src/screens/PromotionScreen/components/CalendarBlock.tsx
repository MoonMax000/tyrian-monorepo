import React from 'react';
import CalendarTable from '../../../screens/EventsCalendarScreen/components/CalendarTable';

export const CalendarBlock = () => {
  return (
    <div className='flex flex-col'>
      <div className='flex gap-4'>
        <div className='border border-regaliaPurple rounded-3xl w-[348px] h-fit p-3'>
          <span className='text-[19px] font-bold  border-b-[1px] border-regaliaPurple w-full flex pb-3'>
            Next Events
          </span>
          <div className='flex flex-col gap-2'>
            {Array.from([0, 1, 2], () => (
              <div className='flex h-[75px] '>
                <span className='pr-4 h-full flex justify-center items-center flex-col font-bold text-[24px] w-[50px] pl-3'>
                  <span className='text-[#B0B0B0] text-[24px] font-bold'>Jun</span> <span>03</span>
                </span>

                <div className='flex flex-col gap-2 items-start justify-center border-[#2E2744] border-l-4 pl-3 mt-2'>
                  <span className='text-[12px]'>SBER</span>
                  <span className='text-[12px]'>Sberbank investor call planned for late June</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='border border-regaliaPurple rounded-3xl w-[708px] h-fit max-h-[347px] p-3'>
          <div className=' border-b-[1px] border-regaliaPurple w-full flex pb-3'>
            <span className='text-[19px] font-bold '>Watchlist</span>
          </div>
          <div className='flex gap-2 w-full gap-x-16 flex-wrap'>
            {Array.from([0, 1, 2, 3, 4, 5], () => (
              <div className='flex h-[75px] '>
                <span className='pr-4 h-full flex justify-center flex-col items-center font-bold text-[24px] w-[50px] pl-3'>
                  <span className='text-[#B0B0B0] text-[24px] font-bold'>Jun</span> <span>03</span>
                </span>

                <div className='flex flex-col gap-2 items-start justify-center border-[#2E2744] border-l-4 pl-3 mt-2'>
                  <span className='text-[12px]'>SBER</span>
                  <span className='text-[12px]'>Sberbank investor call planned for late June</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <CalendarTable />
    </div>
  );
};
