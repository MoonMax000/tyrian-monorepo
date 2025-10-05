'use client';

import React, { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';

import {
  useGetFearAndGreedQuery,
  useGetGainersLosersQuery,
  useGetListingLatestQuery,
  useGetMostVolatileCoinsQuery,
  useGetTotalCapQuery,
} from '@/store/api/cryptoApi';

import Button from '@/components/UI/Button';
import Container from '@/components/UI/Container';
import Paper from '@/components/UI/Paper';
import { Tab } from '@/components/UI/TabsNavigation/interfaces';
import { MarketCapitalization } from './components/MarketCapitalization';
import TabsNavigation from '@/components/UI/TabsNavigation';
import AllCoinsTable from '@/components/CoinsTable';
import HorizontalGreedometer from '@/components/HorizontalGreedometer';
import HorizontalAltmeter from '@/components/HorizontalAltmeter';
import DominateScale from '@/components/DominateScale';
import CoinLeaders from '@/components/CoinLeaders';
import MainAreaBarChart, { ICurrencyDataQuote } from '@/components/Diagrams/MainAreaBarChart';
import { TimeRange, timeRangeParams } from '@/components/Diagrams/types';

import DominateIndex from '@/assets/indexes/dominate.svg';
import ThreadIndex from '@/assets/indexes/mock-block-test.svg';

import IconHint from '@/assets/icons/icon-hint.svg';
import IconCharts from '@/assets/icons/icon-charts.svg';
import IconFiltr from '@/assets/icons/icon-filtr.svg';
import CategoriesTable from '@/components/CategoriesTable';
import { CHART_COLORS } from '@/components/Diagrams/chartColors';
import Filter from '@/components/UI/Filter';
import { useRouter } from 'next/navigation';

const tabs: Tab[] = [
  { label: 'All Cryptocurrencies', tab: 'trends', content: <AllCoinsTable /> },
  { label: 'Categories', tab: 'categories', content: <CategoriesTable /> },
];

const buttons = [
  { label: '1М', value: '1M' },
  { label: '1Y', value: '1Y' },
  { label: 'ALL', value: 'ALL' },
];

const moreButtons: { label: string; value: TimeRange }[] = [
  { label: '1D', value: '1D' },
  { label: '1M', value: '1M' },
  { label: '3M', value: '3M' },
  { label: '1Y', value: '1Y' },
  { label: '5Y', value: '5Y' },
  { label: 'ALL', value: 'ALL' },
];

const HomeScreen = () => {
  const [mainIndexActiveBtn, setMainIndexActiveBtn] = useState<TimeRange>(moreButtons[2].value);
  const [dominateIndexActiveBtn, setDominateIndexActiveBtn] = useState(moreButtons[0].value);
  const [etfIndexActiveBtn, setEtfIndexActiveBtn] = useState(buttons[0].value);
  const { count, interval } = timeRangeParams[mainIndexActiveBtn];

  const { data: topGainers } = useGetGainersLosersQuery({ limit: 6, sort_dir: 'desc' });
  const { data: topLosers } = useGetGainersLosersQuery({ limit: 6, sort_dir: 'asc' });
  const { data: topListing } = useGetListingLatestQuery({ limit: 6 });
  const { data: topVolatility } = useGetMostVolatileCoinsQuery();
  const { data: fearAndGreed } = useGetFearAndGreedQuery({ limit: 1 });
  const { data: totalCap, isLoading } = useGetTotalCapQuery({ count, interval });
  const latestIndex = fearAndGreed?.[0].value ?? 50;

  const router = useRouter();

  const transformedData: ICurrencyDataQuote[] = useMemo(() => {

    if (!totalCap?.quotes) return [];

    return totalCap.quotes.reduce<ICurrencyDataQuote[]>((acc, entry, index, arr) => {
      const usdData = entry.quote?.[2781];
      if (entry.timestamp && usdData?.total_market_cap) {
        acc.push({
          date: entry.timestamp,
          time: new Date(entry.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          total_market_cap: usdData.total_market_cap,
          total_volume_24h: usdData.total_volume_24h,
          bar_color:
            index > 0 &&
            usdData.total_volume_24h >= (arr[index - 1].quote?.[2781]?.total_volume_24h || 0)
              ? CHART_COLORS.barPositive
              : CHART_COLORS.barNegative,
        });
      }
      return acc;
    }, []);
  }, [totalCap?.quotes]);

  return (
    <Container>
      {/*<div className='flex items-center w-full justify-between mb-6 pt-8'>*/}
      {/*  <div className='w-full flex flex-col gap-1'>*/}
      {/*    <div className='w-full flex justify-between'>*/}
      {/*      <h1 className='text-[32px] font-semibold leading-[32px]'>*/}
      {/*        Цены криптовалют на сегодняшний день*/}
      {/*      </h1>*/}
      {/*      <div className='flex gap-6'>*/}
      {/*        <Button children='Разместить' icon={<IconArrwow />} />*/}
      {/*        <Button children='API' />*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*    <p className='text-[15px] font-semibold opacity-[48%]'>*/}
      {/*      Капитализация мирового крипто-рынка составляет 3.29 триллиона долларов, снизившись на*/}
      {/*      0.42% за последние сутки. {''}*/}
      {/*      <span className='underline'>Подробнее.</span>*/}
      {/*    </p>*/}
      {/*  </div>*/}
      {/*</div>*/}
      {/*<div className='flex justify-between h-[441px]'>*/}
      {/*  <PopularCoinsTable />*/}
      {/*  /!* <Paper className='px-4 pt-4 pb-6 w-[197px] flex flex-col '> *!/*/}
      {/*    <IndexGreedBlock/>*/}
      {/*    /!* <h2 className='text-[15px] leading-5 font-bold text-center mb-3'>*/}
      {/*      Индекс страха и жадности*/}
      {/*    </h2>*/}
      {/*    <Greedometer /> *!/*/}
      {/*  /!* </Paper> *!/*/}
      {/*  /!*<Paper className='pt-6 px-0 w-[417px] flex flex-col '>*!/*/}
      {/*  /!*  <NewsBlock news={mockNews} />*!/*/}
      {/*  /!*</Paper>*!/*/}
      {/*</div>*/}

      <div className='flex flex-col justify-center items-center gap-4 mb-24 mt-[120px]'>
        <h1 className='text-[56px] font-bold text-center hyphens-auto leading-[100%]'>
          TyrianTrade <br /> Stock Analysis
        </h1>
        <p className='text-center text-[15px] font-semibold text-[#a7a8a9] hyphens-auto'>
          Daily Stock Market Analysis
        </p>
      </div>

      <div className='flex flex-col gap-6'>
        <div className='flex gap-6'>
          <MarketCapitalization />
          <div className='flex flex-col justify-between'>
            <Link href='fear-and-greed'>
              <Paper className='w-[417px] flex flex-col gap-4'>
                <div className='flex items-center gap-1'>
                  <h5 className='font-semibold text-[15px]'>Fear & Greed Index</h5>
                  <IconHint />
                </div>
                <HorizontalGreedometer value={latestIndex} />
              </Paper>
            </Link>

            <Link href='alt-season'>
              <Paper className='w-[417px] flex flex-col gap-4'>
                <div className='flex items-center gap-1'>
                  <h5 className='font-semibold text-[15px]'>Altseason Index</h5>
                  <IconHint />
                </div>
                <HorizontalAltmeter value={38} />
              </Paper>
            </Link>

            <Link href='btc-dominance'>
              <Paper className='w-[417px] flex flex-col gap-4'>
                <div className='flex items-center gap-1'>
                  <h5 className='font-semibold text-[15px]'>BTC Dominance</h5>
                  <IconHint />
                </div>
                <DominateScale />
              </Paper>
            </Link>

            <Paper className='w-[417px] flex flex-col gap-4'>
              <div className='flex items-center gap-1'>
                <h5 className='font-semibold text-[15px]'>Open Interest</h5>
                <IconHint />
              </div>
              <div className='flex justify-between items-center'>
                <div className='flex flex-col uppercase'>
                  <p className='text-[12px] font-semibold text-[#87888b]'>PERPETUALS</p>
                  <span className='text-15px font-bold'>$58.45Т</span>
                </div>
                <div className='flex flex-col uppercase'>
                  <p className='text-[12px] font-semibold text-[#87888b]'>FUTURES</p>
                  <span className='text-15px font-bold'>$351.54B</span>
                </div>
              </div>
            </Paper>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-6'>
          {topListing && (
            <CoinLeaders title='Volume Leaders' link='/lists/volume-leaders' stocks={topListing} />
          )}
          {topVolatility && (
            <CoinLeaders
              title='Most Volatile Coins'
              link='/lists/most-volatile-coins'
              stocks={topVolatility}
            />
          )}
          {topGainers && <CoinLeaders title='Top Gainers' link='/lists/top-gainers' stocks={topGainers} />}
          {topLosers && <CoinLeaders title='Top Losers' link='/lists/top-losers' stocks={topLosers} />}
        </div>
        <Paper className='flex flex-col gap-4'>
          <div className='flex justify-between items-center'>
            <h3 className='font-bold text-2xl'>Cryptocurrency ETF Net Flows</h3>
            <div className='flex gap-[16px]'>
              <Filter
                options={buttons}
                active={etfIndexActiveBtn}
                onChange={(value) => setEtfIndexActiveBtn(value as TimeRange)}
              />
              <Filter
                options={[{ label: 'SHOW MORE', value: '' }]}
                active={'none'}
                onChange={() => router.push('/tracker/eth')}
              />
            </div>
          </div>
          <div className='flex gap-6 items-center'>
            <h2 className='text-[32px] text-[#2ebd85] font-bold'>+$7,290,331,899</h2>
            <p className='text-[15px] text-[#87888b] font-semibold'>24 Feb 2025</p>
          </div>
          <ThreadIndex className='select-none pointer-events-none' />
        </Paper>

        <div className='flex flex-col gap-6'>
          <div className='flex items-center gap-3'>
            <h2 className='font-bold text-[40px]'>Total Cryptocurrency Market Cap</h2>
          </div>
          <Paper className='flex flex-col h-[470px]'>
            <Filter
              options={moreButtons}
              active={mainIndexActiveBtn}
              onChange={(value) => setMainIndexActiveBtn(value as TimeRange)}
            />
            <div className='pt-6 flex-1 overflow-hidden'>
              {isLoading ? (
                ''
              ) : (
                <MainAreaBarChart data={transformedData} selectedTimeRange={mainIndexActiveBtn} />
              )}
            </div>
          </Paper>
        </div>

        <div className='flex flex-col gap-6'>
          <div className='flex items-center gap-3'>
            <h2 className='font-bold text-[40px]'>Market Cap Dominance</h2>
          </div>
          <Paper>
            <Filter
              options={moreButtons}
              active={dominateIndexActiveBtn}
              onChange={(value) => setDominateIndexActiveBtn(value as TimeRange)}
            />
            <div className='pt-6'>
              <DominateIndex className='select-none pointer-events-none' />
            </div>
          </Paper>
        </div>
      </div>

      <Paper className='!p-0 mt-10 mb-40'>
        <Suspense fallback={<div>Loading...</div>}>
          <TabsNavigation tabs={tabs} className='text-purple'>
            <div className='flex  justify-between px-6 mt-6'>
              <Button className='text-xs' size='sm' icon={<IconCharts />} variant='secondary'>
                <span className='opacity-45'>TOP</span>
              </Button>
              <Button className='text-xs' size='sm' icon={<IconFiltr />} variant='secondary'>
                <span className='opacity-45'>FILTERS</span>
              </Button>
            </div>
          </TabsNavigation>
        </Suspense>
      </Paper>
    </Container>
  );
};
export default HomeScreen;
