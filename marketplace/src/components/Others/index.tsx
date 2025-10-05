'use client';
import { FC } from 'react';
import FilterControls from '../UI/FilterControls';
import Pagination from '../UI/Pagination';
import OtherCard from '../CARDS/OtherCard';
import SubCount from '../UI/SubCount';
import TagLabel from '../UI/TagLabel';
import IconOther from '@/assets/mock/mock-other.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Others: FC = () => {
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
        <h2 className='text-bold-31'>Others</h2>
        <FilterControls onFilterChange={handleFilterChange} onSearch={handleSearch} />
      </div>
      <div className='mt-12 flex flex-col gap-6'>
        {Array.from({ length: 12 }).map((_, i) => (
          <OtherCard
            key={i}
            icon={IconOther.src}
            onClick={() => push('/others-tab/1')}
            iconProfile={
              <Image
                src={'/productIcon.png'}
                width={64}
                height={64}
                alt='avatar'
                className='size-[64px] rounded-lg object-cover'
              />
            }
            action={
              <div className='flex gap-1'>
                <SubCount personse={3} personseMax={10} />
                <TagLabel value='Windows/Mac' category='some' />
                <TagLabel value='Top Seller' category='some' />
              </div>
            }
          />
        ))}
      </div>
      <div className='flex justify-center mt-12 mb-[80px]'>
        <Pagination totalPages={4} currentPage={1} onChange={() => {}} />
      </div>
    </section>
  );
};

export default Others;
