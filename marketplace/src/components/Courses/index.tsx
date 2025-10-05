'use client';
import { FC } from 'react';
import FilterControls from '../UI/FilterControls';
import CourseCard from '../CARDS/CourseCard';
import IconExpert from '@/assets/mock/mock-expert.svg';
import Pagination from '../UI/Pagination';
import { useRouter } from 'next/navigation';

const Courses: FC = () => {
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
        <h2 className='text-bold-31'>Courses and Training materials</h2>
        <FilterControls onFilterChange={handleFilterChange} onSearch={handleSearch} />
      </div>
      <div className='mt-12 flex flex-col gap-6'>
        {Array.from({ length: 12 }).map((_, i) => (
          <CourseCard
            key={i}
            onClick={() => i === 0 && push('/courses-tab/1')}
            icon={<IconExpert />}
          />
        ))}
      </div>
      <div className='flex justify-center mt-12 mb-[80px]'>
        <Pagination totalPages={4} currentPage={1} onChange={() => {}} />
      </div>
    </section>
  );
};

export default Courses;
