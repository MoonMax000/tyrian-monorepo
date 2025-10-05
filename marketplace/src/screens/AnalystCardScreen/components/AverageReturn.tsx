import type { FC } from 'react';

import Paper from '@/components/UI/Paper';

import Question from '@/assets/icons/icon-question-wavy-border.svg';

export const AverageReturn: FC = () => (
  <Paper className='py-4 px-[14.25px] flex flex-col gap-y-4 justify-between items-center'>
    <div className='flex items-center gap-x-1 text-lighterAluminum'>
      <h3 className='text-[12px] uppercase font-bold'>Average Return</h3>
      <Question width={16} height={16} className='hover:text-white' />
    </div>
    <span className='text-[31px] font-bold text-green'>111.14%</span>
    <p className='text-[15px] font-bold text-center'>Average return per transaction</p>
  </Paper>
);
