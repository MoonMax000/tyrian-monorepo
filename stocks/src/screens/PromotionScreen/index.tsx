'use client';
import Tabs from '@/components/Tabs';
import { ReactNode, useMemo, useState } from 'react';
import { tabs } from './constants';
import StatisticsBlock from './components/StatisticsBlock';
import SocialNetworks from './components/SocialNetworks';
import FaqBlock from './components/FaqBlock';
import CurrencyStocksBlock from './components/CurrencyStocksBlock';
import Review from './components/Tabs/Review';
import Container from '@/components/UI/Container';
import Rating from './components/Rating';
import StockStatisticData from './components/StockStatisticData';
import Finance from './components/Tabs/Finance';
import Dividents from './components/Tabs/Dividents';
import Events from './components/Tabs/Events';
import { CalendarBlock } from './components/CalendarBlock';
import VolatilityIndex from '../HomeScreen/components/VolatilityIndex';

const PromotionScreen = () => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].key);

  const tabComponents = useMemo((): Record<(typeof tabs)[number]['key'], ReactNode> => {
    return {
      review: <Review />,
      financial_indicators: <Finance />,
      dividends: <Dividents />,
      actions: <Events />,
      calendar: <CalendarBlock />,
    };
  }, []);

  return (
    <>
      <Container>
        <div className='grid grid-cols-[65%,1fr] gap-6 mb-6'>
          <StockStatisticData />

          <VolatilityIndex volatility={10} />
        </div>
        <StatisticsBlock />

        <Tabs
          className='mt-[64px] mb-6'
          tabClassName='text-sh1 opacity-[64%] data-[active=true]:opacity-100'
          activeTabKey={activeTab}
          tabs={tabs}
          onClick={(tab) => setActiveTab(tab.key)}
        />
        {tabComponents[activeTab]}

        {/* <section className='mt-[64px]'>
          <StockAbout />
        </section> */}
        <section className='mt-[64px]'>
          <CurrencyStocksBlock />
        </section>
      </Container>

      <section className='my-[88px]'>
        <SocialNetworks />
      </section>

      <Container as='section' className='mb-[132px]'>
        <FaqBlock />
      </Container>
    </>
  );
};

export default PromotionScreen;
