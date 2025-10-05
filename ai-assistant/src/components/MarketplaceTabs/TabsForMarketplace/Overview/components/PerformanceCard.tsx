import React from 'react';
import ProgresCard from '@/components/ProgresCard/ProgresCard';

const cards = [
  {
    title: 'Conversation Rate',
    value: 68,
  },
  {
    title: 'Customer retention',
    value: 82,
  },
  {
    title: 'Product Quality',
    value: 94,
  },
  {
    title: 'Support Response',
    value: 76,
  },
];
function PerformanceCard() {
  return (
    <div className='container-card p-4 flex flex-col justify-between gap-[28px] w-full'>
      <div className='flex w-full items-center justify-between'>
        <span className='font-bold text-[24px]'>Performance</span>
        <span className='text-[15px] font-bold text-lightPurple cursor-pointer'>
          View all
        </span>
      </div>
      {cards.map((card, index) => (
        <ProgresCard key={index} title={card.title} value={card.value} />
      ))}
    </div>
  );
}

export default PerformanceCard
