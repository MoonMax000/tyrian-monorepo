'use client';
import { FC } from 'react';
import Head from '../../components/Head';
import Input from '../../components/Input';
import UploadComponent from '../../components/Upload';
import SpecificationsCard from '../../components/Cards/SpecificationsCard';
import Monetization from '../../components/Monetization';
import DescriptionCard from '../../components/Cards/DescriptionCard';
import Footer from '../../components/Footer';
import Card from '../../components/Card';
import PerformanceWithTItle from './PerformanceWithTItle';
import PersonalPortfolio from './PersonalPortfolio';

const AnalystTrader: FC = () => {
  return (
    <div className='flex flex-col gap-6 pb-60'>
      <div className='z-[100] custom-bg-blur border border-regaliaPurple rounded-[24px]'>
        <Head hideRisk />
        <div className='p-4 flex flex-col gap-4'>
          <UploadComponent title='Upload cover image' />

          <Input label='COMPANY' placeholder='Enter text...' />
          <Input label='OCCUPIED POSITION' placeholder='CEO' />
          <Input label='MARKETS' placeholder='Binance, NASDAQ, etc...' />
          <Input label='ASSETS' placeholder='BTC, ETH, TESLA, etc...' />
          <Input label='ANALYSIS' placeholder='Technical & Fundamental Analysis' />
          <Input label='FORECAST ACCURACY' placeholder='100%' />
          <Input label='FOLLOWERS' placeholder='1 000' />
          <Input label='TRADING DAYS' placeholder='1 000' />
          <Input label='STABILITY INDEX' placeholder='5.0' />
          <Input
            label='PERSONAL QUALITIES'
            placeholder='Stable, High Frequency, Long-Term, Veteran, Sociable'
          />

          <Monetization className='py-4' />
        </div>
      </div>
      <PerformanceWithTItle title='Portfolio Performance Chart' />
      <PerformanceWithTItle title='Index Performance Chart' />

      <PersonalPortfolio title='Personal Portfolio' />

      <Card hasSwitch title='Stock Buying and Selling in Portfolio' />
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

export default AnalystTrader;
