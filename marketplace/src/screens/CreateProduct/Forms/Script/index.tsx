'use client';
import { FC } from 'react';
import Head from '../../components/Head';
import Input from '../../components/Input';
import UploadComponent from '../../components/Upload';
import DemoCard from '../../components/Cards/DemoCard';
import SpecificationsCard from '../../components/Cards/SpecificationsCard';
import Monetization from '../../components/Monetization';
import DescriptionCard from '../../components/Cards/DescriptionCard';
import Footer from '../../components/Footer';

const Script: FC = () => {
  return (
    <div className='flex flex-col gap-6 pb-60'>
      <div className='z-[100] custom-bg-blur border border-regaliaPurple rounded-[24px]'>
        <Head hideRisk />
        <div className='p-4 flex flex-col gap-4'>
          <Input label='Product’s title' />

          <UploadComponent />

          <Input label='TYPE' placeholder='Script...' />
          <Input label='EXCHANGE' placeholder='Binance, NASDAQ, etc...' />
          <Input label='PLATFORM' placeholder='Windows/Mac OS' />
          <Input label='CATEGORY' placeholder='Crypto, Stocks, etc...' />
          <Input label='ADDITIONAL TAGS' placeholder='automation, risk_managment, etc...' />
          <Input
            label='COMPATIBILITY'
            placeholder='Metatrader 4, metatrader 5, TradingView, etc...'
          />
          <Input label='REQUIREMENTS' placeholder='Python 3.8+, Numpy, Pandas, etc...' />
          <Input label='INDUSTRY' placeholder='Trading and Finance, etc...' />
          <Input label='REVENUE' placeholder='USD $N/Month' />
          <Input label='COUNTRY' placeholder='Russia, etc...' />
          <Input label='TAGS' placeholder='Automation, Trading, Script, etc...' />

          <Monetization className='py-4' />
        </div>
      </div>
      <DemoCard />
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

export default Script;
