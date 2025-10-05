'use client';
import React, { FC } from 'react';
import Head from '../../components/Head';
import Input from '../../components/Input';
import UploadComponent from '../../components/Upload';
import AccuracyChartCard from '../../components/Cards/AccuracyChartCard';
import PerformanceCard from '../../components/Cards/PerformanceCard';
import SpecificationsCard from '../../components/Cards/SpecificationsCard';
import Monetization from '../../components/Monetization';
import DescriptionCard from '../../components/Cards/DescriptionCard';
import Footer from '../../components/Footer';
import Card from '../../components/Card';

const Algorithm: FC = () => {
  return (
    <div className='flex flex-col gap-6 pb-60'>
      <div className='z-[100] custom-bg-blur border border-regaliaPurple rounded-[24px]'>
        <Head />
        <div className='p-4 flex flex-col gap-4'>
          <Input label='Product’s title' />

          <UploadComponent />

          <Input label='CRYPTOCURRENCIES' placeholder='Bitcoin, Ethereum, etc...' />
          <Input label='PAIR' placeholder='BTC/USDT' />
          <Input label='MAX DRAWDOWN' placeholder='10.00%' />
          <Input label='MARKET TYPE' placeholder='Futures' />
          <Input label='TYPE' placeholder='Stocks, Futures, etc...' />
          <Input label='STRATEGY' placeholder='Tech Analysis' />
          <Input label='SETTINGS' placeholder='Custom Indications' />
          <Input label='ESTIMATED APR' placeholder='+10.00%' />
          <Input label='UPTIME' placeholder='1d 1h 1m' />
          <Input label='AUM (USDT)' placeholder='100,000.00' />
          <Input label='SUBSCRIBERS' placeholder='1 000' />
          <Input label='PROFIT' placeholder='100% per month' />
          <Input label='STRATEGY' placeholder='Scalping' />
          <Input label='ROI (CALC. APY FOR 30 DAYS)' placeholder='+10.00%' />
          <Input label='ROI (CALC. APY FOR 1 YEAR)' placeholder='+10.00%' />

          <Monetization className='py-4' />
        </div>
      </div>

      <PerformanceCard />
      <AccuracyChartCard />
      <Card hasSwitch title='Bot Subscribers Rating' />
      <DescriptionCard />
      <SpecificationsCard
        items={[
          { name: 'strategy', placeholder: 'RSI, Bollinger Bands etc...' },
          { name: 'risk', placeholder: 'Risk: Low, drawdown up to 10% etc...' },
          { name: 'size', placeholder: 'Signals: 5–10 per week etc...' },
        ]}
      />

      <Footer className='pt-6' />
    </div>
  );
};

export default Algorithm;
