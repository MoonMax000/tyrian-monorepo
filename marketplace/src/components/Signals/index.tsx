'use client';
import { FC } from 'react';
import SignalCard from '../CARDS/SignalCard';
import Pagination from '../UI/Pagination';
import FilterControls from '../UI/FilterControls';
import { useRouter } from 'next/navigation';

const handleFilterChange = (filterType: string, value: string | number) => {
  console.log(`Filter changed: ${filterType} = ${value}`);
};

const handleSearch = (searchTerm: string) => {
  console.log(`Search term: ${searchTerm}`);
};

const Signals: FC = () => {
  const { push } = useRouter();

  const handleClick = (index: number) => {
    if (index === 1) {
      push('/signals-tab/indicators/1');
    } else {
      push('/signals-tab/signals/1');
    }
  };

  return (
    <section className='mt-16'>
      <div className='flex flex-col gap-4'>
        <h2 className='text-bold-31'>Signals and Technical indications</h2>
        <FilterControls onFilterChange={handleFilterChange} onSearch={handleSearch} />
      </div>
      <div className='flex mt-12 flex-wrap gap-6'>
        {Array.from({ length: 14 }).map((_, index) => (
          <SignalCard key={index} handleClick={() => handleClick(index)} />
        ))}
      </div>
      <div className='flex justify-center mt-12 mb-[80px]'>
        <Pagination totalPages={4} currentPage={1} onChange={() => {}} />
      </div>
    </section>
  );
};

export default Signals;
