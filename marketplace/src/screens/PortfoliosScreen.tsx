'use client';
import { FC } from 'react';
import ContentWrapper from '@/components/UI/ContentWrapper';

import One from '@/screens/mock/Portfolios/1.svg';
import Two from '@/screens/mock/Portfolios/2.svg';
import Trhee from '@/screens/mock/Portfolios/3.svg';
import Four from '@/screens/mock/Portfolios/4.svg';
import Five from '@/screens/mock/Portfolios/5.svg';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/Tabs';

const PortfoliosScreen: FC = () => {
  return (
    <div className='mt-6 mb-40'>
      <ContentWrapper>
        <One />
        <Tabs defaultValue='main' className='mt-6  max-w-screen'>
          <TabsList className='flex border-b justify-between border-white border-opacity-10 '>
            <div className='flex space-x-6'>
              <TabsTrigger
                value='main'
                className='text-[17px] !font-medium pb-4  border-b-4 border-transparent'
              >
                Главная
              </TabsTrigger>
              <TabsTrigger
                value='papers'
                className='text-[17px] !font-medium pb-4  border-b-4 border-transparent'
              >
                Бумаги
              </TabsTrigger>
            </div>
          </TabsList>
          <TabsContent value='main'>
            <BuySubscribe />
          </TabsContent>
          <TabsContent value='papers'>
            <BuySubscribe />
          </TabsContent>
        </Tabs>
      </ContentWrapper>
    </div>
  );
};

export default PortfoliosScreen;

const BuySubscribe = () => {
  return (
    <div className='mt-[17px]'>
      <div className='flex gap-6'>
        <Two />
        <Trhee />
        <Four />
      </div>
      <Five className='mt-6 mb-40' />
    </div>
  );
};
