import React, { FC } from 'react';
import IconKing from '@/assets/icons/icon-king.svg';
import IconCheck from '@/assets/icons/icon-check.svg';
import IconCase from '@/assets/icons/icon-case.svg';

const cards = [
  {
    icon: <IconCheck />,
    title: 'Premium Package',
    count: 142,
    desc: 'Payment received from Jane Doe',
    timePast: '2 minutes',
  },
  {
    icon: <IconCheck />,
    title: 'Standard License',
    count: 98,
    desc: 'Payment received from John Doe',
    timePast: '10 minutes',
  },
  {
    icon: <IconKing />,
    title: 'Basic Subscription',
    desc: 'Emma Wilson left a 5-star review',
    count: 76,
    timePast: '3 hours',
  },
  {
    icon: <IconCase />,
    title: 'Products Available',
    desc: 'You added “Premium Support” to your store',
    count: 24,
    timePast: '5 hours',
  },
];

const RecentActivityCard: FC = () => {
  return (
    <div className='container-card p-4 flex flex-col justify-between gap-4 w-full'>
      <div className='flex w-full items-center justify-between'>
        <span className='font-bold text-[24px]'>Recent Activity</span>
        <span className='text-[15px] font-bold text-lightPurple cursor-pointer'>
          View all
        </span>
      </div>
      {cards.map((card, index) => (
        <div
          key={index}
          className='flex items-start justify-between gap-2 flex-1 min-w-0 w-full'
        >
          <div className='bg-[#2E2744] p-[6px] rounded-[50px] mr-2'>
            {card.icon}
          </div>
          <div className='flex flex-col flex-1 min-w-0'>
            <span className='text-[15px] font-bold'>{card.title}</span>
            <span className='text-lightPurple text-[12px] font-[500] truncate'>
              {card.desc}
            </span>
            <span className='text-lighterAluminum text-[12px] font-[700]'>
              {card.timePast} ago
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivityCard;
