import React, { FC } from 'react';
import IconKing from '@/assets/icons/icon-king.svg';
import IconStar from '@/assets/icons/icon-star.svg';
import IconMedal from '@/assets/icons/icon-medal.svg';
import IconBox from '@/assets/icons/icon-box.svg';

const cards = [
  {
    icon: <IconKing />,
    title: 'Premium Package',
    count: 142,
    price: '$1,200.00',
  },
  {
    icon: <IconStar />,
    title: 'Standard License',
    count: 98,
    price: '$750.00',
  },
  {
    icon: <IconMedal />,
    title: 'Basic Subscription',
    count: 76,
    price: '$350.00',
  },
  {
    icon: <IconBox />,
    title: 'Custom Development',
    count: 24,
    price: '$4,800.00',
  },
];

const TopProductsCard: FC = () => {
  return (
    <div className='container-card p-4 flex flex-col justify-between gap-[28px] w-full'>
      <div className='flex w-full items-center justify-between'>
        <span className='font-bold text-[24px]'>Top Products</span>
        <span className='text-[15px] font-bold text-lightPurple cursor-pointer'>
          View all
        </span>
      </div>
      {cards.map((card, index) => (
        <div
          key={index}
          className='flex items-center justify-between flex-1 min-w-0 w-full'
        >
          <div className='bg-[#2E2744] p-[6px] rounded-[50px] mr-2'>
            {card.icon}
          </div>
          <div className='flex flex-col flex-1 min-w-0'>
            <span className='text-[15px] font-bold'>{card.title}</span>
            <span className='text-lightPurple text-[12px] font-[500] truncate'>
              {card.count} sales
            </span>
          </div>
          <span className='text-[15px] font-medium'>{card.price}</span>
        </div>
      ))}
    </div>
  );
};

export default TopProductsCard;
