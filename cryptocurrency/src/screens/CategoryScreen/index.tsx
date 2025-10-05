'use client';

import { Suspense, useState } from 'react';
import Container from '@/components/UI/Container';
import MadeInTable from './components/CoinsTable';
import { Tab } from '@/components/UI/TabsNavigation/interfaces';
import TabsNavigation from '@/components/UI/TabsNavigation';
import Paper from '@/components/UI/Paper';
import Pagination from '@/components/UI/Pagination';
import ProcentLabel from '@/components/UI/ProcentLabel';
import SmallChart from './components/SmallChart';
import { useGetCategoryDetailsQuery } from '@/store/api/cryptoApi';
import CoinsTable from './components/CoinsTable';
import Button from '@/components/UI/Button';
import { formatCurrencyShort } from '@/utils/helpers/formatCurrencyShort';

interface Props {
  slug: string;
}

const LIMIT = 25;

const CategoryScreen = ({ slug }: Props) => {
  const [page, setPage] = useState<number>(1);

  const { data: categoryDetails, isFetching } = useGetCategoryDetailsQuery({
    id: slug,
    page: 1,
    limit: LIMIT,
  });

  const tabs: Tab[] = [
    {
      label: 'Топ токенов',
      tab: 'topTokens',
      content: <CoinsTable coins={categoryDetails?.coins!} />,
    },
  ];

  const chartPositiveData = [100, 100, 20, 25, 20, 15, 15, 20, 22, 20];
  const chartNegativeData = [90, 100, 90, 60, 70, 60, 50, 40, 32, 20];

  const hasNextPage = categoryDetails && categoryDetails.coins.length === LIMIT;
  const totalPages = hasNextPage ? page + 1 : page;

  const handlePageChange = (page: number) => {
    if (!isFetching && page !== page) {
      setPage(page);
    }
  };

  if (isFetching || !categoryDetails) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <div className='flex justify-between mt-[48px]'>
        <div className='flex flex-col items-baseline max-w-[600px]'>
          <h1 className='text-h2 max-w leading-[100%]'>
            Top {categoryDetails.name} by Market Cap
          </h1>
          <p className='text-vody-15 mt-[16px] text-[#a7a8a9] font-semibold'>
            Below are the leading coins and tokens associated with {' '}
            {categoryDetails.name} ranked by market capitalization. To sort the list differently,
            click on options like 24h or 7d to view based on other timeframes.
          </p>
        </div>
        <div>
          <Button variant='secondary'>Explore</Button>
          <Button variant='secondary' className='ml-[24px]'>API</Button>
        </div>
      </div>

      <div className='flex flex-col gap-6 pt-10'>
        <div className='flex items-center gap-6'>
          <Paper className='flex gap-5'>
            <div className='flex flex-col items-baseline gap-4'>
              <p className='text-body-12 opacity-40 uppercase'>Market cap</p>
              <div className='flex items-center gap-2'>
                <b className='font-bold text-[15px]'>{formatCurrencyShort(categoryDetails.market_cap)}</b>
                <ProcentLabel value={categoryDetails.market_cap_change} symbolAfter='%' />
              </div>
            </div>
            <SmallChart data={chartPositiveData} color='#2EBD85' />
          </Paper>
          <Paper className='flex gap-5'>
            <div className='flex flex-col items-baseline gap-4'>
              <p className='text-body-12 opacity-40 uppercase'>Volume</p>
              <div className='flex items-center gap-2'>
                <b className='font-bold text-[15px]'>{formatCurrencyShort(categoryDetails.volume)}</b>
                <ProcentLabel value={categoryDetails.volume_change} symbolAfter='%' />
              </div>
            </div>
            <SmallChart data={chartNegativeData} color='#EF454A' />
          </Paper>
        </div>

        <Paper className='p-0 mb-40 px-0 pt-0'>
          <Suspense fallback={<div>Loading...</div>}>
            <TabsNavigation tabs={tabs} />
          </Suspense>
          <div className='mt-8'>
            <Pagination
              leftArrowDisabled={page === 1}
              rightArrowDisabled={page === totalPages}
              currentPage={page}
              totalPages={totalPages}
              onChange={handlePageChange}
            />
          </div>
        </Paper>
      </div>
    </Container>
  );
};

export default CategoryScreen;
