'use client';

import { mockSecurityData } from './constants';
import { StocksService } from '@/services/StocksService';
import { FC, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import SwitchButtons from '@/components/UI/SwitchButtons';
import { TradingDiagram } from './components/TradingDiagram';
import { SocialActivites } from './components/SocialActivites';
import { BeginnerView } from './components/BeginnerView';
import { AdvancedView } from './components/AdvancedView';
/*
import { RevenueAndNetProfit } from './RevenueAndNetProfit';
import { HistoryOfProfit } from './components/HistoryOfProfit';
import { RevenueAnalysis } from './components/RevenueAnalysis';
import { mockNews } from '@/screens/HomeScreen/constants';
import NewsBlock from '../../NewsBlock';
import { FinancialStability } from './components/FinancialStability';
import { IncomeAndRevenueHistory } from './components/IncomeAndRevenueHistory';
import { DebtsAndAssets } from './components/DebtsAndAssets';
import { CashFlow } from './components/CashFlow';
import { ROE } from './components/ROE';
import { ReturnOnAssets } from './components/ReturnOnAssets';
import { ReturnOnEquity } from './components/ReturnOnEquity';
import { ShareholderStructure } from './ShareholderStructure';
import { TradingVolumes } from './TradingVolumes';
import { Shareholders } from './components/Shareholders';
import Loaders from '@/components/UI/Skeleton';
*/

const viewTypes = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'advanced', label: 'Advanced' },
];

const Review: FC<{ stockName: string }> = ({ stockName }) => {
  const [paperData, setPaperData] = useState(mockSecurityData);

  const [viewType, setViewType] = useState(viewTypes[0].value);

  const { data } = useQuery({
    queryKey: ['getPaperDatta', stockName],
    queryFn: async () => {
      try {
        const data = await StocksService.peperDetails(stockName);
        console.log(data);
        return data;
      } catch (error) {
        console.log('Login failed:', error);
        throw error;
      }
    },
  });

  const { data: assetAyieldData } = useQuery({
    queryKey: ['getAssetAyield', stockName],
    queryFn: async () => {
      try {
        const data = await StocksService.assetAyield(stockName);
        console.log(data);
        return data;
      } catch (error) {
        console.log('Login failed:', error);
        throw error;
      }
    },
  });

  const { data: indicesData } = useQuery({
    queryKey: ['getIndices', stockName],
    queryFn: async () => {
      try {
        const data = await StocksService.indices(stockName);
        console.log(data);
        return data;
      } catch (error) {
        console.log('Login failed:', error);
        throw error;
      }
    },
  });

  useEffect(() => {
    if (data?.data) {
      const response = data.data;
      const updatedPaperData = mockSecurityData.map((item) => ({
        ...item,
        value: response[item.label] !== undefined ? response[item.label] : item.value,
      }));
      setPaperData(updatedPaperData);
    }
  }, [data]);

  const {
    data: fundamentalData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['fundamentalAnalysis', stockName],
    queryFn: () => StocksService.fundamentalAnalysis(stockName),
    staleTime: 60000,
    enabled: !!stockName,
  });

  const yearPrice = fundamentalData?.data?.year_price;
  const position = useMemo(() => {
    if (
      !yearPrice ||
      yearPrice.current === undefined ||
      yearPrice.min === undefined ||
      yearPrice.max === undefined ||
      yearPrice.max === yearPrice.min
    ) {
      return null;
    }

    return ((yearPrice.current - yearPrice.min) / (yearPrice.max - yearPrice.min)) * 100;
  }, [yearPrice]);

  return (
    <section>
      <SwitchButtons
        items={viewTypes}
        currentValue={viewType}
        onChange={setViewType}
        className='mb-4'
      />
      <TradingDiagram />
      {viewType === 'beginner' ? <BeginnerView /> : <AdvancedView />}
      {/*
        <div className='grid grid-cols-2 gap-6'>
        <Paper className='!px-0 py-6 !pb-0'>
          <h3 className='text-h4 ml-6'>Fundamental Analysis</h3>

          <div className='grid items-center gap-2 justify-between grid-cols-[50%,auto,auto] px-6 py-[11px] mb-2 mt-6 bg-moonlessNight'>
            <p className='opacity-40 text-body-12 font-bold uppercase'>Indicator</p>
            <p className='opacity-40 text-body-12 font-bold uppercase'>Company</p>
            <p className='opacity-40 text-body-12 font-bold uppercase'>Industry</p>
          </div>
          {isLoading ? (
            <Loaders className='w-full h-[80%]' />
          ) : error ? (
            <p className='text-center text-red-500'>Ошибка загрузки данных</p>
          ) : (
            <>
              <ul>
                <li className='grid items-center grid-cols-[48%,auto,auto] py-2 px-6 border-b-2 border-moonlessNight'>
                  <p className='text-body-15'>P\E (LTM)</p>
                  <p className='text-body-15 text-right w-full'>
                    {fundamentalData?.data?.peRatio?.company.toFixed(2)}
                  </p>
                  <p className='text-body-15 text-right w-full'>
                    {fundamentalData?.data?.peRatio?.industry.toFixed(2)}
                  </p>
                </li>
                <li className='grid items-center grid-cols-[48%,,auto,auto] py-2 px-6 border-b-2 border-moonlessNight'>
                  <p className='text-body-15'>P\BV (LTM)</p>
                  <p className='text-body-15 text-right w-full'>
                    {fundamentalData?.data?.pbRatio?.company.toFixed(2)}
                  </p>
                  <p className='text-body-15 text-right w-full'>
                    {fundamentalData?.data?.pbRatio?.industry.toFixed(2)}
                  </p>
                </li>
                <li className='grid items-center grid-cols-[48%,,auto,auto] py-2 px-6 border-b-2 border-moonlessNight'>
                  <p className='text-body-15'>EV/EBITDA (LTM)</p>
                  <p className='text-body-15 text-right w-full'>
                    {fundamentalData?.data?.enterpriseValueOverEBITDA?.company.toFixed(2)}
                  </p>
                  <p className='text-body-15 text-right w-full'>
                    {fundamentalData?.data?.enterpriseValueOverEBITDA?.industry.toFixed(2)}
                  </p>
                </li>
                <li className='grid items-center grid-cols-[48%,,auto,auto] py-2 px-6 border-b-2 border-moonlessNight'>
                  <p className='text-body-15'>Net Debt/EBITDA (LTM)</p>
                  <p className='text-body-15 text-right w-full'>
                    {fundamentalData?.data?.netDebtToEBITDA?.company.toFixed(2)}
                  </p>
                  <p className='text-body-15 text-right w-full'>
                    {fundamentalData?.data?.netDebtToEBITDA?.industry.toFixed(2)}
                  </p>
                </li>
                <li className='grid items-center grid-cols-[48%,,auto,auto] py-2 px-6 border-b-2 border-moonlessNight'>
                  <p className='text-body-15'>ROE (LTM)</p>
                  <p className='text-body-15 text-right w-full'>
                    {fundamentalData?.data?.roe?.company.toFixed(2)}
                  </p>
                  <p className='text-body-15 text-right w-full'>
                    {fundamentalData?.data?.roe?.industry.toFixed(2)}
                  </p>
                </li>
              </ul>

              <div className='pt-4'>
                <h3 className='text-h4 mx-6'>1-year price change</h3>

                <div className='px-6 pt-4 pb-[26px]'>
                  <div className='flex items-center justify-between text-body-12 mb-2'>
                    <span>${fundamentalData?.data?.year_price?.min.toFixed(2)}</span>
                    <span>${fundamentalData?.data?.year_price?.max.toFixed(2)}</span>
                  </div>

                  <div className='bg-gradient-to-r relative from-transparent via-purple to-purple h-6 w-full rounded-[4px]'>
                    {position !== null && (
                      <div
                        className='absolute bottom-0 flex flex-col items-center w-fit group'
                        style={{ left: `${position}%` }}
                      >
                        {position > 15 && position < 85 && (
                          <div className='text-body-15 mb-2'>{yearPrice?.current.toFixed(2)} ₽</div>
                        )}
                        <div className='relative'>
                          <div className='size-6 rounded-full bg-purple outline outline-[5px] outline-moonlessNight cursor-pointer' />
                          <div className='absolute bottom-8 left-[65px] transform -translate-x-1/2 hidden group-hover:flex bg-white text-black text-sh1 px-4 py-4 rounded whitespace-nowrap'>
                            {yearPrice?.current.toFixed(2)} ₽
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className='flex items-center justify-between text-body-12 font-semibold'>
                    <span className='opacity-48'>MIN</span>
                    <span className='opacity-48'>MAX</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </Paper>

        <RevenueAndNetProfit />
      </div>
        */}
      {/* <div><FinancialStability /></div>*/}
      {/* <div className='grid grid-cols-2 gap-6'>
        <IncomeAndRevenueHistory />
        <DebtsAndAssets />
       // <ProfitAssets />
      </div>*/}
      {/*
        <section>
        <CashFlow />
      </section>
      <div className='grid grid-cols-2 gap-6'>
        <ROE />
        <ReturnOnAssets />
        <ReturnOnEquity />

        <Sr2 />
        <History2 />
        <HistoryOfProfit />
        <ShareholderStructure />
        <TradingVolumes />
      </div>
        */}
      {/*    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 items-start mt-6'>
        <RevenueAndNetProfit />
        <HistoryOfProfit />
      </div>
      <RevenueAnalysis /> */}
      {/*
             <section>
        <StructurCapital2 />
      </section>
      <section>
        <Shareholders />
      </section>

      <section className='mt-[64px]'>
        <NewsBlock news={mockNews} />
      </section>
      */}
      <SocialActivites />
      {/*
      <section className='mt-[64px]'>
       <NewsBlock news={mockNews} />
      </section>
      */}
    </section>
  );
};

export default Review;
