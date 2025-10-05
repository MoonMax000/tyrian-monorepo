'use client';

import React, { Suspense, useState } from 'react';
import Button from '@/components/UI/Button';
import Container from '@/components/UI/Container';
import Paper from '@/components/UI/Paper';
import Pagination from '@/components/UI/Pagination';
import { Tab } from '@/components/UI/TabsNavigation/interfaces';
import TabsNavigation from '@/components/UI/TabsNavigation';
import ReviewTable from '@/components/RewiewTable';
import StreamTable from '@/components/StreamTable';
import Filter from '@/components/UI/Filter';

import NetFlowImage from '@/assets/tracker/net-flow.svg';
import TotalNetImage from '@/assets/tracker/total-net.svg';

const tabs: Tab[] = [
  { label: 'Review', tab: 'trends', content: <ReviewTable /> },
  { label: 'Streams', tab: 'streams', content: <StreamTable /> },
];

const buttons = [
  { label: 'ALL ETF', value: 'all' },
  { label: 'BITCOIN ETF', value: 'btc-etf' },
];

const moreButtons = [
  { label: '1M', value: '1M' },
  { label: '1Y', value: '1Y' },
  { label: 'ALL', value: 'ALL' },
];

const contentTypes = [
  { label: 'COINS', value: 'coins' },
  { label: 'FUNDS', value: 'funds' },
];

const contentTypesBTC = [
  { label: 'TOTAL NET CASH FLOW', value: 'total-net-cash-flow' },
  { label: 'FUNDS', value: 'total-net-funds' },
];

interface TrackerScreenProps {
  params: { symbol: string };
}

const TrackerScreen: React.FC<TrackerScreenProps> = ({ params }) => {
  const [page, setPage] = useState<number>(1);

  const [whichEtf, setWhichEtf] = useState(buttons[0].value);
  const [activeButton, setActiveButton] = useState(moreButtons[0].value);
  const [contentType, setContentType] = useState(contentTypes[0].value);
  const [contentTypeBTC, setContentTypeBTC] = useState(contentTypesBTC[0].value);

  return (
    <Container className='mt-12'>
      <Filter className='!p-0' options={buttons} active={whichEtf} onChange={(value) => setWhichEtf(value as string)} />
      <div className='flex flex-col justify-center gap-4 mb-12 pt-6'>
        <h1 className='text-[54px] font-bold text-left'>Cryptocurrency ETF Tracker</h1>
        <p className='text-left text-middle max-w-[540px] text-[#a7a8a9]'>
          Below are ETFs (exchange-traded funds) that have invested in cryptocurrencies. Some crypto funds have a single asset class, such as Bitcoin. Others use a broader range of underlying investments or more complex strategies. We provide detailed information on inflows and outflows, assets under management (AUM), and net asset value (NAV).
        </p>
      </div>
      {whichEtf === 'all' ? (
        <div>
          <div className='flex gap-6 mb-6'>
            <div className='flex flex-col gap-6'>
              <Paper className='w-[344px] flex flex-col gap-4 h-fit'>
                <div className='flex items-center gap-3'>
                  <h5 className='font-semibold text-[15px]'>Net Flow into ETFs</h5>
                </div>
                <h5 className='text-[32px] text-[#2ebd85] font-bold'>+ $7.33B</h5>
              </Paper>
              <Paper className='w-[344px] flex flex-col gap-4 h-fit'>
                <h5 className='font-semibold text-[15px]'>Historical meanings</h5>
                <div className='flex items-center justify-between'>
                  <div className='flex flex-col gap-2'>
                    <span className='text-small opacity-40'>LAST WEEK</span>
                    <span className='text-small opacity-40'>LAST MONTH</span>
                    <span className='text-small opacity-40'>LAST 3 MONTHS</span>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <span className='text-[15px] text-[#2ebd85] font-bold'>+ $15.67B</span>
                    <span className='text-[15px] text-[#2ebd85] font-bold'>+ $74.55B</span>
                    <span className='text-[15px] text-[#EF454A] font-bold'>- $24.92B</span>
                  </div>
                </div>
              </Paper>
              <Paper className='w-[344px] flex flex-col gap-4 h-fit'>
                <h5 className='font-semibold text-[15px]'>Annual figures</h5>

                <div className='flex items-center justify-between'>
                  <div className='flex flex-col gap-2'>
                    <span className='text-small opacity-40'>THE BEST MONTH (DEC '24)</span>
                    <span className='text-small opacity-40'>THE WORST MONTH (APR '24)</span>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <span className='text-[15px] text-[#2ebd85] font-bold'>+ $15.67B</span>
                    <span className='text-[15px] text-[#EF454A] font-bold'>- $24.92B</span>
                  </div>
                </div>
              </Paper>
            </div>
            <Paper className='flex flex-col gap-3 w-full'>
              <div className='flex justify-between items-center z-10 bg-[#181A20] rounded-xl'>
                <h3 className='font-bold text-2xl'>
                  Net Flow into ETFs
                </h3>
                <div className='flex gap-6'>
                  <Filter options={contentTypes} active={contentType} onChange={(value) => setContentType(value as string)} />
                  <Filter options={moreButtons} active={activeButton} onChange={(value) => setActiveButton(value as string)} />
                </div>
              </div>
              <NetFlowImage className='select-none' />
            </Paper>
          </div>
          <div className='flex gap-6 justify-between'>
            <Paper className='!p-0 flex flex-col gap-6 w-[528px] h-[369px] bg-[url("/mock2.png")] bg-center bg-no-repeat'></Paper>
            <Paper className='!p-0 flex flex-col gap-6 w-[528px] h-[369px] bg-[url("/mock3.png")] bg-center bg-no-repeat'></Paper>
          </div>
          <div className='p-0 mt-10 mb-40 px-0 pt-0'>
            <Suspense fallback={<div>Loading...</div>}>
              <TabsNavigation tabs={tabs} className='text-purple' />
            </Suspense>

            <div className='mt-8'>
              <Pagination currentPage={page} totalPages={4} onChange={setPage} />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className='flex gap-6 mb-6'>
            <div className='flex flex-col gap-6'>
              <Paper className='w-[344px] flex flex-col gap-4 h-fit'>
                <div className='flex items-center gap-3'>
                  <h5 className='font-semibold text-[15px]'>Net Flow into Bitcoin ETFs</h5>
                </div>
                <h5 className='text-[32px] text-[#2ebd85] font-bold'>+ $7.33B</h5>
              </Paper>
              <Paper className='w-[344px] flex flex-col gap-4 h-fit'>
                <h5 className='font-semibold text-[15px]'>Historical meanings</h5>
                <div className='flex items-center justify-between'>
                  <div className='flex flex-col gap-2'>
                    <span className='text-small opacity-40'>LAST WEEK</span>
                    <span className='text-small opacity-40'>LAST MONTH</span>
                    <span className='text-small opacity-40'>LAST 3 MONTHS</span>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <span className='text-[15px] text-[#2ebd85] font-bold'>+ $15.67B</span>
                    <span className='text-[15px] text-[#2ebd85] font-bold'>+ $74.55B</span>
                    <span className='text-[15px] text-[#EF454A] font-bold'>- $24.92B</span>
                  </div>
                </div>
              </Paper>
              <Paper className='w-[344px] flex flex-col gap-4 h-fit'>
                <h5 className='font-semibold text-[15px]'>Annual figures</h5>

                <div className='flex items-center justify-between'>
                  <div className='flex flex-col gap-2'>
                    <span className='text-small opacity-40'>THE BEST MONTH (DEC '24)</span>
                    <span className='text-small opacity-40'>THE WORST MONTH (APR '24)</span>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <span className='text-[15px] text-[#2ebd85] font-bold'>+ $15.67B</span>
                    <span className='text-[15px] text-[#EF454A] font-bold'>- $24.92B</span>
                  </div>
                </div>
              </Paper>
            </div>
            <Paper className='flex flex-col gap-3 w-full'>
              <div className='flex items-center justify-between'>
                <h3 className='font-bold text-2xl'>
                  Net Flow into BTC ETFs
                </h3>
                <div className='flex gap-4'>
                  <Filter className='!p-0' options={contentTypesBTC} active={contentTypeBTC} onChange={(value) => setContentTypeBTC(value as string)} />
                  <Filter className='!p-0' options={moreButtons} active={activeButton} onChange={(value) => setActiveButton(value as string)} />
                </div>
              </div>
              <TotalNetImage className='select-none' />
            </Paper>
          </div>
          <div className='flex gap-6'>
            <Paper className='!p-0 flex flex-col gap-6 w-[528px] h-[310px] bg-[url("/mock5.png")] bg-center bg-no-repeat'></Paper>
            <Paper className='!p-0 flex flex-col gap-6 w-[528px] h-[310px] bg-[url("/mock6.png")] bg-center bg-no-repeat'></Paper>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <TabsNavigation tabs={tabs} className='text-purple' />
          </Suspense>

          <div className='mt-8 flex justify-center pb-[180px]'>
            <Pagination currentPage={page} totalPages={4} onChange={setPage} />
          </div>
        </div>
      )}
    </Container>
  );
};
export default TrackerScreen;
