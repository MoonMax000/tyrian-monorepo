'use client';

import { Suspense } from 'react';
import Container from '@/components/UI/Container';
import TabsNavigation from '@/components/UI/TabsNavigation';
import { Tab } from '@/components/UI/TabsNavigation/interfaces';
import Paper from '@/components/UI/Paper';
import { useGetGainersLosersQuery } from '@/store/api/cryptoApi';
import CoinsTable from '../components/CoinsTable';

const TopLosersScreen = () => {
  const { data: coins, isFetching } = useGetGainersLosersQuery({ limit: 20, sort_dir: 'asc' });

  const tabs: Tab[] = [
    {
      label: 'Топ токенов',
      tab: 'topTokens',
      content: <CoinsTable coins={coins ?? []} />,
    },
  ];

  if (isFetching || !coins) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <div className='flex justify-between mt-[48px]'>
        <h1 className='text-h2 leading-[100%]'>Top Losers</h1>
      </div>

      <div className='flex flex-col gap-6 pt-10'>
        <Paper className='p-0 mb-40'>
          <Suspense fallback={<div>Loading...</div>}>
            <TabsNavigation tabs={tabs} />
          </Suspense>

          {/* <div className='mt-8'>
            <Pagination
              leftArrowDisabled={true}
              rightArrowDisabled={true}
              currentPage={1}
              totalPages={1}
              onChange={() => {}}
            />
          </div> */}
        </Paper>
      </div>
    </Container>
  );
};

export default TopLosersScreen;
