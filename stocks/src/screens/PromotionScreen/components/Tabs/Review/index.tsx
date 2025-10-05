'use client';

import Paper from '@/components/Paper';
import { mockSecurityData, IFundamentalAnalityc } from './constants';
import StockPriceChart from './StockPriceChart';
import { StocksService } from '@/services/StocksService';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import PercentLabel from '@/components/UI/percentLabel';
import NewsBlock from '../../NewsBlock';
import { mockNews } from '@/screens/PromotionScreen/constants';
import { usePathname } from 'next/navigation';
import BasicsAnalysis from '../BasicsAnalysis';
import ProfitAssets from '../ProfitAssets';
import ShareholderStructure from '../ShareholderStructure';
import RevenueAndNetProfit from './RevenueAndNetProfit';

const Review = () => {
  const pathname = usePathname();
  const path = pathname.split('/').pop();
  const stockSymbol = path || 'SBER';

  const [paperData, setPaperData] = useState<IFundamentalAnalityc[]>(mockSecurityData);

  const { data } = useQuery({
    queryKey: ['getPaperDatta', stockSymbol],
    queryFn: async () => {
      try {
        const data = await StocksService.peperDetails(stockSymbol);
        console.log(data);
        return data;
      } catch (error) {
        console.log('Login failed:', error);
        throw error;
      }
    },
  });

  const { data: assetAyieldData } = useQuery({
    queryKey: ['getAssetAyield', stockSymbol],
    queryFn: async () => {
      try {
        const data = await StocksService.assetAyield(stockSymbol);
        console.log(data);
        return data;
      } catch (error) {
        console.log('Login failed:', error);
        throw error;
      }
    },
  });

  const { data: indicesData } = useQuery({
    queryKey: ['getIndices', stockSymbol],
    queryFn: async () => {
      try {
        const data = await StocksService.indices(stockSymbol);
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

  useEffect(() => {
    console.log('asdasdasdasdsadasdas', assetAyieldData?.data);
  }, [assetAyieldData]);

  return (
    <section className='flex flex-col gap-6'>
      <div className='grid grid-cols-[65%,1fr] gap-6  mt-7'>
        <StockPriceChart />
        <BasicsAnalysis />
      </div>
      <div className='grid grid-cols-2 gap-6'>
        <ProfitAssets />

        <Paper className='!px-0 pt-6 pb-4 '>
          <h3 className='text-h4 ml-6 mb-6'>Данные о бумаге</h3>

          <ul>
            {paperData.map((item) => (
              <li
                key={item.indicator}
                className='grid items-center gap-2 justify-between grid-cols-[45%,auto] odd:bg-[#272A32] py-[13px] px-6'
              >
                <p className='text-body-15 opacity-[0.48]'>{item.indicator}</p>

                <p className='text-body-15 '>{item.value}</p>
              </li>
            ))}
          </ul>
        </Paper>
      </div>
      <div className='grid grid-cols-2 gap-6'>
        <ShareholderStructure />
        <RevenueAndNetProfit />
      </div>
      <div className='grid grid-cols-2 gap-6'>
        <Paper className='!px-0 py-6 !pb-0'>
          <h3 className='text-h4 mx-6'>Объемы торгов</h3>
          <div className='grid items-center gap-2 justify-between grid-cols-[30%,auto,auto,auto] px-6 pb-3 pt-3 mt-3 bg-[#2A2C32]'>
            <p className='opacity-40 text-body-12 font-bold uppercase '>Данные</p>
            <p className='opacity-40 text-body-12 font-bold uppercase text-right'>Кол-во сделок</p>
            <p className='opacity-40 text-body-12 font-bold uppercase text-right'>
              Объем сделок, шт
            </p>
            <p className='opacity-40 text-body-12 font-bold uppercase text-right'>объем сделок</p>
          </div>

          <ul>
            {assetAyieldData?.data?.data &&
              assetAyieldData?.data?.data.slice(0, 5).map((item, index) => (
                <li
                  key={`${item.value}-${index}`}
                  className='grid items-center   grid-cols-[30%,23.3%,23.3%,23.3%]  py-6 px-6 border-b-2 border-blackedGray last:border-none'
                >
                  <p className='opacity-[0.48] text-body-15'>
                    {item.market_title === 'Режим переговорных сделок'
                      ? 'Переговорные сделки'
                      : item.market_title}
                  </p>
                  <p className='text-body-15 text-right w-full'>{item.trades_number}</p>
                  <p className='opacity-[0.48] text-body-15 text-right'>{item.volume}</p>
                  <p className='text-body-15 text-right'>{item.value} ₽</p>
                </li>
              ))}
            <li className='grid items-center   grid-cols-[30%,23.3%,23.3%,23.3%]  py-6 px-6 border-b-2 border-blackedGray last:border-none'>
              <p className='opacity-[0.48] text-body-15'>Всего (без РЕПО)</p>
              <p className='text-body-15 text-right w-full'>
                {assetAyieldData?.data.total_trades_without_repo}
              </p>
              <p className='opacity-[0.48] text-body-15 text-right'>
                {assetAyieldData?.data.total_volume_without_repo}
              </p>
              <p className='text-body-15 text-right'>
                {assetAyieldData?.data.total_amount_without_repo} ₽
              </p>
            </li>
            <li className='grid items-center   grid-cols-[30%,23.3%,23.3%,23.3%]  py-6 px-6 border-b-2 border-blackedGray last:border-none'>
              <p className='opacity-[0.48] text-body-15'>Всего</p>
              <p className='text-body-15 text-right w-full'>{assetAyieldData?.data.total_trades}</p>
              <p className='opacity-[0.48] text-body-15 text-right'>
                {assetAyieldData?.data.total_volume}
              </p>
              <p className='text-body-15 text-right'>{assetAyieldData?.data.total_amount} ₽</p>
            </li>
          </ul>
        </Paper>
        <Paper className='!px-0 py-6 !pb-0'>
          <div className='flex items-center justify-between px-6'>
            <h3 className='text-h4 '>Входит в индексы</h3>
            <Link href='' className='text-body-15 underline underline-offset-2 text-purple'>
              {'Все индексы >'}
            </Link>
          </div>
          <div className='grid items-center  justify-between grid-cols-[15%,40%,15%,30%] px-6 pb-3 pt-3 mt-3 bg-[#2A2C32]'>
            <p className='opacity-40 text-body-12 font-bold uppercase '>Код</p>
            <p className='opacity-40 text-body-12 font-bold uppercase '>наименование</p>
            <p className='opacity-40 text-body-12 font-bold uppercase text-right'>Значение</p>
            <p className='opacity-40 text-body-12 font-bold uppercase text-right truncate'>
              Изменение
            </p>
          </div>

          <ul>
            {indicesData?.data &&
              indicesData?.data?.slice(0, 5).map((item) => (
                <li
                  key={item.code}
                  className='grid items-center grid-cols-[15%,40%,15%,30%]  py-6 px-6 border-b-2 border-blackedGray last:border-none h-[70px]'
                >
                  <p className='opacity-[0.48] text-body-12 bold'>{item.code}</p>
                  <p className='text-body-15  w-full'>{item.shortname}</p>
                  <p className='opacity-[0.48] text-body-15 text-right'>{item.current_value}</p>
                  <div className='flex justify-end gap-[1px]'>
                    <PercentLabel value={item.last_change_percents} symbolAfter='%'></PercentLabel>
                    <PercentLabel value={item.last_change}></PercentLabel>
                  </div>
                </li>
              ))}
          </ul>
        </Paper>
      </div>
      <section className='mt-[64px]'>
        <NewsBlock news={mockNews} />
      </section>
    </section>
  );
};

export default Review;
