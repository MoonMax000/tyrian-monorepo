'use client';
import { FC } from 'react';
import FilterControls from '../UI/FilterControls';

const LeaderBoard: FC = () => {

  const handleFilterChange = (filterType: string, value: string | number) => {
    console.log(`Filter changed: ${filterType} = ${value}`);
  };

  const handleSearch = (searchTerm: string) => {
    console.log(`Search term: ${searchTerm}`);
  };

  return (
    <section className='mt-16'>
      <div className='flex flex-col gap-4'>
        <h2 className='text-bold-31'>Recommendations</h2>
        <FilterControls
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />
      </div>

    </section>
  );
};

export default LeaderBoard;
