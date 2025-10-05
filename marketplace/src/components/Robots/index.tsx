'use client';
import { FC } from 'react';

import RobotCard from '../CARDS/RobotCard';
import Pagination from '../UI/Pagination';
import FilterControls from '@/components/UI/FilterControls';

const Robots: FC = () => {
  const handleFilterChange = (filterType: string, value: string | number) => {
    console.log(`Filter changed: ${filterType} = ${value}`);
  };

  const handleSearch = (searchTerm: string) => {
    console.log(`Search term: ${searchTerm}`);
  };

  return (
    <section className='mt-16'>
      <div className='flex flex-col gap-4'>
        <h2 className='text-bold-31'>Trading robots and Algorithms</h2>
        <FilterControls onFilterChange={handleFilterChange} onSearch={handleSearch} />
      </div>
      <div className='flex mt-12 flex-wrap gap-6'>
        {Array.from({ length: 18 }).map((_, index) => (
          <RobotCard
            key={index}
            routePath={index === 1 ? '/robots-tab/algorithms/1' : '/robots-tab/robots/1'}
          />
        ))}
      </div>
      <div className='flex justify-center mt-12 mb-[80px]'>
        <Pagination totalPages={4} currentPage={1} onChange={() => {}} />
      </div>
    </section>
  );
};

export default Robots;
