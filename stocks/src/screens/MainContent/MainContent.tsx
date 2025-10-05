'use client';
import { GradientButton } from '@/components/GradientButton/GradientButton';
import Image from 'next/image';
import React, { useState } from 'react';
import { countries, forexData, StocksValues, stocksValues, tabs } from './mockData';
import { MajorIndicates } from './MajorIndicates';
import { Stocks } from './Stocks';
import { BoundsGroup } from './BoundsGroup';
import { FundsGroup } from './FundsGroup';
import { StocksBlock } from '@/components/StocksBlock/StocksBlock';
import { ForexCard } from '@/components/ForexCard/ForexCard';
import Tabs from '@/components/Tabs';
import { SocialNetworkCard } from '@/components/SocialNetworkCard/SocialNetworkCard';
import { CalendarGroup } from './CalendarGroup';
import { ETFsBlock } from './ETFsBlock';
import { LiveNewsContent } from './LiveNewsContent';
import FaqBlock from '../DividendCalendarScreen/components/FaqBlock';
import { ProvidedTools } from '@/components/ProvidedTools/ProvidedTools';
import { useQuery } from '@tanstack/react-query';
import { Bond, StocksService } from '@/services/StocksService';
import { useRouter } from 'next/navigation';
import mockBondsImg from '@/assets/mock-bonds.png';
import { Crypto } from './Crypto';

export const MainContent = () => {
  const [activeTab, setActiveTab] = useState({ name: 'Crypto', key: '0' });

  const { push } = useRouter();

  const { data: corpBondsData } = useQuery({
    queryKey: ['corp-bonds'],
    queryFn: () => StocksService.corporateBonds('All Bonds'),
  });

  const { data: govtBondsData } = useQuery({
    queryKey: ['govt-bonds'],
    queryFn: () => StocksService.governmentBonds('All Bonds'),
  });

  const transformBondsDataToStocksValues = (data?: Bond[]): StocksValues[] | undefined => {
    return data?.map((item) => ({
      title: item.document_eng,
      logo: mockBondsImg.src,
      desc: item.bbgid,
      price: item.initial_nominal_price,
      percent: parseFloat(item.cupon_eng.replace('%', '')),
    }));
  };

  const mockFunds = new Array(9).fill({
    title: 'S$P 500 ETF',
    desc: 'SPDR',
    price: '$452.12',
  });

  return (
    <div className='flex flex-col gap-24 p-7 items-center !overflow-hidden'>
      <div className='w-[1500px] flex flex-col items-start !overflow-hidden'>
        <Image
          className='absolute z-[-1] left-[738px] top-[-18px]'
          width={1473}
          height={921}
          alt='image'
          src={'/Ribbon1.png'}
        />
        <h1 className='text-[56px] font-bold mb-28 mt-20'>Research your Market</h1>
        <div className='flex flex-col w-fit items-center justify-center gap-6'>
          <div className='flex flex-wrap w-[960px] gap-2 rounded-lg p-2 '>
            {countries.map((country) => (
              <div
                key={country.name}
                className='w-[228px] h-[60px] gap-2 rounded-lg border border-regaliaPurple p-2 pl-4 pr-4 flex items-center'
              >
                <Image src={country.flag} width={44} height={44} alt={country.name} />
                <span className='text-[19px] font-bold'>{country.name}</span>
              </div>
            ))}
          </div>
          <GradientButton className='cursor-pointer'>All Countries</GradientButton>
        </div>
      </div>

      <MajorIndicates />
      <Stocks />
      <div className='flex w-full flex-col items-center gap-20 relative mt-20'>
        <Image
          className='absolute z-[-20] left-[-150px] top-[-600px] rotate-[-05deg] scale-[120%]'
          width={2380}
          height={1487}
          alt='image'
          src={'/Ribbon3.png'}
        />
        <h1 className='text-purple text-[39px] font-bold'>Bonds</h1>
        <div className='flex gap-5 h-fit'>
          <BoundsGroup
            onClick={() => push('/crypto-currency/bonds')}
            values={transformBondsDataToStocksValues(govtBondsData?.data.data) as StocksValues[]}
          />
          <BoundsGroup
            title='Corporate Bonds'
            onClick={() => push('/crypto-currency/bonds')}
            values={transformBondsDataToStocksValues(corpBondsData?.data.data) as StocksValues[]}
          />
        </div>
      </div>
      <div className='flex w-full flex-col items-center gap-20 mt-20'>
        <h1 className='text-purple text-[39px] font-bold'>Funds</h1>
        <div className='flex gap-5'>
          <BoundsGroup />
          <FundsGroup values={mockFunds} />
        </div>
        <div className='mt-20 flex gap-4'>
          <ETFsBlock title='Bitcoin ETFs' />
          <ETFsBlock title='Commodities ETFs' />
        </div>
      </div>

      <div className='flex w-full flex-col items-center gap-20 mt-20 relative'>
        <Image
          className='absolute z-[-1] left-[0px] top-[-900px] scale-[112%]'
          src='/Ribbon4.png'
          alt='ribbon'
          width={2126}
          height={1329}
        />
        <Image
          className='absolute z-[-1] left-[0px] top-[500px]'
          src='/Ribbon5.png'
          alt='ribbon'
          width={2126}
          height={1329}
        />
        <h1 className='text-purple text-[39px] font-bold'>Commodities</h1>
        <div className='flex gap-5 flex-wrap max-w-[1509px]'>
          {Array.from([0, 1, 2, 3, 4, 5], () => (
            <StocksBlock key={Math.random()} content={stocksValues} title='Title' />
          ))}
        </div>
      </div>
      <Crypto />
      <div className='flex w-full flex-col items-center gap-20 mt-20 relative'>
        <Image
          className='absolute z-[-1] left-[-70px] top-[-300px] scale-110'
          src='/Ribbon6.png'
          alt='ribbon'
          width={2126}
          height={1329}
        />
        <h1 className='text-purple text-[39px] font-bold'>Forex</h1>
        <div className='flex gap-5'>
          <ForexCard key={Math.random()} content={forexData} title='Majors' />
          <ForexCard key={Math.random()} content={forexData} title='Currence Indices' />
        </div>
      </div>
      <div className='flex w-full flex-col items-center gap-20 mt-20 max-w-[1509px]'>
        <h1 className='text-purple text-[39px] font-bold'>Social Network</h1>
        <div className='w-full'>
          <div className='w-full'>
            <Tabs
              activeTabKey={activeTab.key}
              onClick={(key) => setActiveTab(key)}
              className='border-b !p-0 border-regaliaPurple gap-8 !w-full'
              tabClassName='!text-[19px] !font-bold !pb-4'
              lineClassName=''
              tabs={tabs}
            />
          </div>
          <div className='flex flex-wrap mt-5 gap-4'>
            {Array.from([0, 1, 2, 3], () => (
              <SocialNetworkCard key={Math.random()} />
            ))}
          </div>
        </div>
      </div>
      <div className='flex w-full flex-col items-center gap-20 mt-20 max-w-[1509px]'>
        <h1 className='text-purple text-[39px] font-bold'>Live News</h1>
        <LiveNewsContent />
      </div>
      <div className='flex w-full flex-col items-center gap-20 mt-20 relative'>
        <Image
          className='absolute z-[-2] left-[100px] top-[-400px] scale-110'
          src='/Ribbon7.png'
          alt='ribbon'
          width={2126}
          height={1329}
        />
        <h1 className='text-purple text-[39px] font-bold'>Calendar</h1>
        <CalendarGroup title='Current Events' />
        <CalendarGroup title='Upcoming Events' />
      </div>
      <div className='flex flex-col relative'>
        <Image
          className='absolute z-[-3] left-[-70px] top-[80px] scale-[175%]'
          src='/Ribbon8.png'
          alt='ribbon'
          width={2526}
          height={1416}
        />
        <FaqBlock className='w-[1300px]' />
        <ProvidedTools />
      </div>
    </div>
  );
};
