'use client';

import { FC } from 'react';
import ContentWrapper from '@/components/UI/ContentWrapper';
import ScriptCard from '@/components/CARDS/ScriptCard';
import IconScript from '@/assets/mock/mock-script.svg';

import SubCount from '@/components/UI/SubCount';
import TagLabel from '@/components/UI/TagLabel';
import Pagination from '@/components/UI/Pagination';
import FilterControls from '@/components/UI/FilterControls';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const handleFilterChange = (filterType: string, value: string | number) => {
  console.log(`Filter changed: ${filterType} = ${value}`);
};

const handleSearch = (searchTerm: string) => {
  console.log(`Search term: ${searchTerm}`);
};

const ScriptScreen: FC = () => {
  const { push } = useRouter();

  return (
    <div className='mt-16 mb-40'>
      <ContentWrapper>
        <div className='flex flex-col gap-4'>
          <h2 className='text-bold-31'>Scripts and Software</h2>
          <FilterControls onFilterChange={handleFilterChange} onSearch={handleSearch} />
        </div>
        <div className='mt-12 flex flex-col gap-6'>
          {Array.from({ length: 10 }).map((_, i) => (
            <ScriptCard
              key={i}
              onClick={() => i === 0 && push('/scripts-tab/1')}
              title='Product Name'
              icon={<IconScript />}
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
        <div className='flex justify-center mt-12'>
          <Pagination totalPages={4} currentPage={1} onChange={() => {}} />
        </div>
      </ContentWrapper>
    </div>
  );
};

export default ScriptScreen;
