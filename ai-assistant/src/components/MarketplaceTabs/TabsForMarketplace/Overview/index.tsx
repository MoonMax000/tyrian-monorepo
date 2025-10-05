'use client';

import { Search } from '@/components/ui/Header/Search';
import TabSwitchButton from '@/components/ui/TabSwitchButton';
import React, { useState } from 'react';
import SearchIconXs from '@/assets/search-xs.svg';
import PlusIcon from '@/assets/button/icon-plus.svg';
import Button from '@/components/ui/Button/Button';
import Card from './components/Card';
import MessagesListCard from './components/MessagesListCard';
import EarningCard from './components/EarningCard';
import { MyProductsShortCard } from './components/MyProductsShortCard';
import { ActiveSubscribers } from './components/ActiveSubscribers';
import { RecentSalesCard } from './components/RecentSalesCard';
import { MyPurchasesShortCard } from './components/MyPurchasesShortCard';
import LatestReview from './components/LatestReview';
import MockChart from '@/assets/mock-chart.svg';
import { PercentLabel } from '@/components/ui/PercentLabel/PercentLabel';
import PerformanceCard from './components/PerformanceCard';
import TopProductsCard from './components/TopProductsCard';
import RecentActivityCard from './components/RecentActivityCard';

const cards = [
  {
    title: 'Total Revenue',
    value: '$24,568.80',
    progress: 12.5,
    textNote: 'vs last month',
  },
  {
    title: 'Active Orders',
    value: '18',
    progress: 8.2,
    textNote: 'vs last month',
  },
  {
    title: 'Products Available',
    value: '32',
    progress: -3.1,
    textNote: 'vs last month',
  },
];

function OverviewTab() {
  const [activeTab, setActiveTab] = useState<'Seller' | 'Buyer'>('Seller');

  return (
    <div className='flex flex-col gap-[24px] max-w-[1252px]'>
      <div className='flex items-center justify-between'>
        <div className='flex p-1 gap-[1px] w-fit border border-regaliaPurple rounded-[32px] bg-[#0C101480] backdrop-blur-[100px]'>
          <TabSwitchButton
            active={activeTab === 'Seller'}
            onClick={() => setActiveTab('Seller')}
            className='rounded-[32px] w-fit px-4'
          >
            Seller
          </TabSwitchButton>
          <TabSwitchButton
            active={activeTab === 'Buyer'}
            onClick={() => setActiveTab('Buyer')}
            className='rounded-[32px] w-fit px-4'
          >
            Buyer
          </TabSwitchButton>
        </div>
        <div className='flex items-center gap-4'>
          <Search
            inputWrapperClassName='h-11 !border-[#181B22]'
            placeholder='Search'
            icon={<SearchIconXs />}
            iconPosition='left'
          />
          <Button
            className='text-nowrap gap-2 h-11'
            variant='primary'
            icon={<PlusIcon />}
          >
            Add Product
          </Button>
        </div>
      </div>
      <div className='flex items-center justify-between gap-6'>
        {cards.map((card, index) => (
          <Card
            key={index}
            {...card}
            wrapperClassName='h-[134px] min-w-[240px]'
          />
        ))}
        <div className='flex w-[481px] container-card h-[134px] relative'>
          <div className='absolute top-4 left-4 flex flex-col gap-0'>
            <span className='text-[12px] font-bold text-lighterAluminum'>
              Sales Growth
            </span>
            <PercentLabel value={18.6} className='text-[24px] font-bold' />
          </div>
          <MockChart />
        </div>
      </div>
      <div className='grid grid-cols-2 gap-6'>
        <MessagesListCard />
        <EarningCard />
        <MyProductsShortCard />
        <ActiveSubscribers />
        <RecentSalesCard />
        <MyPurchasesShortCard />
      </div>
      <LatestReview />
      <div className='flex justify-between gap-[25px] w-full'>
        <PerformanceCard />
        <TopProductsCard />
        <RecentActivityCard />
      </div>
    </div>
  );
}

export default OverviewTab;
