import React from 'react';
import { IndicatorTag } from '@/components/ui/IndicatorTag/IndicatorTag';

type PayoutsRowProps = {
  date: string;
  amount: string;
  status: string;
};

export function PayoutsRow({ amount, date, status }: PayoutsRowProps) {
  return (
    <>
      <span className='text-left'>{date}</span>
      <span className='text-center'>{amount}</span>
      <div className='flex justify-end'>
        <div className='w-14'>
          <IndicatorTag
            className='w-fit flex h-fit'
            type={status === 'Completed' ? 'darckGreen' : 'orange'}
          >
            {status}
          </IndicatorTag>
        </div>
      </div>
    </>
  );
}
