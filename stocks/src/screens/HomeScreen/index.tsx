'use client';

import { useState, FC, useEffect } from 'react';
import { tabs } from './constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/Tabs';
import AttributeCard from '@/components/UI/AttributeCard';
import ModalV2 from '@/components/UI/ModalV2';
import StatisticsBlockMock from './components/StatisticsBlockMock';
import VolatilityIndex from './components/VolatilityIndex';
import StockStatisticData from './components/StockStatisticData';
import { AboutSberModal } from './components/AboutSberModal';
import { sberAttributes } from './constants';
import { useQuery } from '@tanstack/react-query';
import { IPaperResponse, StocksService } from '@/services/StocksService';

const HomeScreen: FC<{ stockName: string }> = ({ stockName }) => {
  const [sberModalVisible, setSberModalVisible] = useState(false);
  const [stockData, setStockData] = useState<Partial<IPaperResponse>>({});

  const { data } = useQuery({
    queryKey: ['GetStockDetails', stockName],
    queryFn: () => StocksService.stockInfo('us', stockName).then((response) => response.data),
  });

  useEffect(() => {
    if (data) {
      setStockData(data);
    }
  }, [data]);

  const toggleSberModal = () => setSberModalVisible((prev) => !prev);

  return (
    <section>
      <div className='flex items-center gap-6 flex-wrap justify-between'>
        <StockStatisticData stockInfo={stockData} stockName={stockName} />
        <VolatilityIndex volatility={50} />
      </div>
      {/* <StatisticsBlock /> */}
      <StatisticsBlockMock />
      <AttributeCard
        title={`About ${stockData?.name}`}
        items={sberAttributes}
        className='p-4 mt-6'
        bottomContent={
          <p className='text-[15px] text-grayLight font-medium inline-block max-w-[720px]'>
            Sberbank Russia PJSC provides commercial banking and financial services. The company
            engages in corporate and retail banking activities, such as corporate loans, asset
            management, payroll projects, leasing, online banking, cash and settlement services,
            among others. In addition, the company offers a wide range of services to financial
            institutions, such as correspondent accounts, custody services, and interbank lending,
            among others. It operates through the following segments: Moscow, Central and Northern
            Regions of European Part of Russia; Volga Region and South of European Part of Russia;
            Ural, Siberia and Far East of Russia; and Other Countries. The company was founded in
            1841 and is headquartered in Moscow, Russia.
          </p>
        }
      />
      <Tabs defaultValue={tabs[0].value} className='mt-20'>
        <TabsList className='!border-gunpowder overflow-x-auto'>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className='text-grayLight text-[19px]'>
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map(({ value, title, Component }) => (
          <TabsContent key={value} value={value} className='mt-4 h-fit'>
            {Component ? <Component stockName={stockName} /> : <p>{title}</p>}
          </TabsContent>
        ))}
      </Tabs>
      <ModalV2 isOpen={sberModalVisible} onClose={toggleSberModal}>
        <AboutSberModal />
      </ModalV2>
    </section>
  );
};

export default HomeScreen;
