'use client';
import ActivityCard from '@/components/ActivityCard/ActivityCard';
import PortfolioCard from '@/components/PortfolioCard/PortfolioCard';
import ProductsCard from '@/components/ProductsCard/ProductsCard';
import SubscribeBlock from '@/components/SubscribeBlock/SubscribeBlock';
import SuggestionCard from '@/components/SuggedtionCard/SuggestionCard';
import UserHeader from '@/components/UserHeader/UserHeader';
import { FC, useState } from 'react';
import UserTabs from '@/components/UserTabs';
import CreatePostBox from '@/components/CreatePostBox/CreatePostBox';
import Pagination from '@/components/ui/Pagination/Pagination';

const HomeScreen: FC<{ isOwn?: boolean }> = ({ isOwn = true }) => {
  const [, setCurrentPage] = useState(1);

  const handlePageChange = (val: number) => {
    setCurrentPage(val);
  };
  //mock variant for demonstration
  return (
    <div id='root-content' className='flex flex-col gap-6'>
      <UserHeader isOwn={isOwn} />
      <div className='grid grid-cols-[1fr_1fr]  gap-6'>
        <div className='flex flex-col gap-6'>
          <SubscribeBlock isOwn={isOwn} />
          <CreatePostBox />
          <UserTabs isOwn={isOwn} />
          <Pagination
            totalPages={4}
            currentPage={1}
            onChange={handlePageChange}
          />
        </div>
        <div className='flex flex-col gap-6'>
          <PortfolioCard />
          <ActivityCard />
          <ProductsCard />
          <SuggestionCard />
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
