'use client';

import { useState, type FC } from 'react';

import DescriptionCard from '@/components/UI/DescriptionCard';
import InfoPopover from '@/components/UI/InfoPopover';
import ProcentLabel from '@/components/UI/ProcentLabel';
import Pagination from '@/components/UI/Pagination';

import IconQuestion from '@/assets/icons/icon-question.svg';
import MockAvatar1 from '@/assets/icons/algorithm/mock-avatar1.svg';
import MockAvatar2 from '@/assets/icons/algorithm/mock-avatar2.svg';
import MockAvatar3 from '@/assets/icons/algorithm/mock-avatar3.svg';
import MockAvatar4 from '@/assets/icons/algorithm/mock-avatar4.svg';
import MockAvatar5 from '@/assets/icons/algorithm/mock-avatar5.svg';
import MockAvatar6 from '@/assets/icons/algorithm/mock-avatar6.svg';
import MockAvatar7 from '@/assets/icons/algorithm/mock-avatar7.svg';
import MockAvatar8 from '@/assets/icons/algorithm/mock-avatar8.svg';

const subscribersMock = [
  {
    Avatar: MockAvatar1,
    name: 'Atlas Quinn',
    subscribeDays: 9,
    profitability: 120.83,
    profit: 466,
  },
  {
    Avatar: MockAvatar2,
    name: 'Mira Sterling',
    subscribeDays: 9,
    profitability: 120.83,
    profit: 466,
  },
  {
    Avatar: MockAvatar3,
    name: 'Drake Lawson',
    subscribeDays: 9,
    profitability: 120.83,
    profit: 466,
  },
  {
    Avatar: MockAvatar4,
    name: 'Eva Ryker',
    subscribeDays: 9,
    profitability: 120.83,
    profit: 466,
  },
  {
    Avatar: MockAvatar5,
    name: 'Silas Trent',
    subscribeDays: 9,
    profitability: 120.83,
    profit: 466,
  },
  {
    Avatar: MockAvatar6,
    name: 'Noa Vance',
    subscribeDays: 9,
    profitability: 120.83,
    profit: 466,
  },
  {
    Avatar: MockAvatar7,
    name: 'Jaxon Wolfe',
    subscribeDays: 9,
    profitability: 120.83,
    profit: 466,
  },
  {
    Avatar: MockAvatar8,
    name: 'Elara Knox',
    subscribeDays: 9,
    profitability: 120.83,
    profit: 466,
  },
];

const BotSubscribersRaiting: FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <DescriptionCard
      title='Bot Subscribers Raiting'
      icon={<IconQuestion />}
      hoverContent={
        <InfoPopover text='Shows the trader’s rank and APR relative to the total investment in USDT.' />
      }
      contentClassName='!p-0'
    >
      <div className='flex flex-1 items-center justify-between p-4 text-[12px] font-bold text-lighterAluminum'>
        <span>Trader 180***2022 deposited 24.00 USDT</span>
        <span>38 minutes ago</span>
      </div>
      <div className='grid grid-cols-2 gap-x-6 gap-y-8 p-4 border-b-[1px] border-t-[1px] border-gunpowder'>
        {subscribersMock.map(({ name, Avatar, profit, profitability, subscribeDays }, i) => (
          <div
            key={name}
            className='flex items-center gap-x-4 text-[15px] font-bold text-lighterAluminum'
          >
            <span>{i + 1}</span>
            <div className='flex items-center gap-x-2'>
              <Avatar className='cursor-pointer' />
              <div className='flex flex-col gap-y-1'>
                <span className='text-white cursor-pointer hover:underline'>{name}</span>
                <span className='text-[12px] uppercase'>Subscribed for {subscribeDays} days</span>
              </div>
            </div>
            <div className='flex flex-col gap-y-1 ml-auto'>
              <ProcentLabel value={profitability} border />
              <span className='text-end text-[12px]'>{profit.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
      <div className='mt-6 flex items-center justify-center'>
        <Pagination currentPage={currentPage} totalPages={3} onChange={setCurrentPage} />
      </div>
    </DescriptionCard>
  );
};

export default BotSubscribersRaiting;
