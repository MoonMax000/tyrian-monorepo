'use client';
import { FC } from 'react';
import ConsultantCard from '../CARDS/ConsultantCard';
import FilterControls from '../UI/FilterControls';
import Pagination from '../UI/Pagination';
import { useRouter } from 'next/navigation';

const Consultants: FC = () => {
  const { push } = useRouter();

  const handleFilterChange = (filterType: string, value: string | number) => {
    console.log(`Filter changed: ${filterType} = ${value}`);
  };

  const handleSearch = (searchTerm: string) => {
    console.log(`Search term: ${searchTerm}`);
  };

  return (
    <section className='mt-16'>
      <div className='flex flex-col gap-4'>
        <h2 className='text-bold-31'>Investment consultants</h2>
        <FilterControls onFilterChange={handleFilterChange} onSearch={handleSearch} />
      </div>

      <div className='flex mt-12 flex-wrap gap-6'>
        {Array.from({ length: 15 }).map((_, index) => (
          <ConsultantCard onClick={() => push('/consultants-tab/1')} key={index} />
        ))}
      </div>

      <div className='flex justify-center mt-12 mb-[80px]'>
        <Pagination totalPages={4} currentPage={1} onChange={() => {}} />
      </div>
    </section>
  );
};

export default Consultants;
