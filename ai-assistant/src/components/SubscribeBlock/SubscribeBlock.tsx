import React, { FC } from 'react';
import Role from '@/assets/system-icons/role.svg';
import Interests from '@/assets/system-icons/interests.svg';
import Paper from '../ui/Paper/Paper';

const SubscribeBlock: FC<{ isOwn?: boolean }> = ({ isOwn }) => {
  return (
    <Paper>
      <div className='p-4 flex flex-col gap-2 text-white'>
        <div className='flex gap-2'>
          <div className='flex items-center w-[320px] p-4 border border-gunpowder rounded-2xl  gap-2'>
            <Role className='mr-2' width={20} height={20} />
            <span className='font-bold text-[15px]'>Individual Investor</span>
          </div>

          <div className='flex gap-2 flex-1'>
            <StatBox label='FOLLOWERS' value='85' />
            <StatBox label='TRADING DAYS' value='438' />
          </div>
        </div>

        <div className='flex items-center w-full border border-gunpowder rounded-2xl p-4 gap-2'>
          <Interests className='mr-2' width={20} height={20} />
          <span className='font-bold text-[15px]'>Stock Market; Crypto; Forex</span>
        </div>

        {!isOwn && (
          <div className='w-full border border-gunpowder rounded-2xl p-4 gap-2'>
            <span className='font-bold text-[15px]'>
              {`Hi, I’m Jane Doe. 
            I’m a self-taught investor exploring markets with curiosity and
            discipline. I focus on long-term value, smart risk-taking, and staying calm when the
            market isn’t. Always learning, always adapting`}
            </span>
          </div>
        )}
      </div>
    </Paper>
  );
};

const StatBox: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className='flex flex-col items-center justify-center w-[131.5px] h-14 border border-gunpowder rounded-2xl p-2'>
    <span className='font-bold text-xs text-lighterAluminum'>{label}</span>
    <span className='font-bold text-[15px]'>{value}</span>
  </div>
);

export default SubscribeBlock;
