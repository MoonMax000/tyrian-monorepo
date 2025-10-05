'use client';
import { FC } from 'react';
import Head from '../../components/Head';
import Input from '../../components/Input';
import UploadComponent from '../../components/Upload';
import AccuracyChartCard from '../../components/Cards/AccuracyChartCard';
import DemoCard from '../../components/Cards/DemoCard';
import PerformanceCard from '../../components/Cards/PerformanceCard';
import SpecificationsCard from '../../components/Cards/SpecificationsCard';
import Monetization from '../../components/Monetization';
import DescriptionCard from '../../components/Cards/DescriptionCard';
import Footer from '../../components/Footer';

const TechnicalIndicator: FC = () => {
  return (
    <div className='flex flex-col gap-6 pb-60'>
      <div className='z-[100] custom-bg-blur border border-regaliaPurple rounded-[24px]'>
        <Head />
        <div className='p-4 flex flex-col gap-4'>
          <Input label='Product’s title' />

          <UploadComponent />

          <Input label='EXCHANGES' placeholder='MOEX, Binance, etc...' />
          <Input label='ASSETS' placeholder='Stocks, Crypto, etc...' />
          <Input label='TYPE' placeholder='Trend/oscillator...' />
          <Input label='TIMEFRAME' placeholder='M15, H1, etc...' />
          <Input label='USE' placeholder='Trend/Reversal...' />
          <Input label='PRODUCT ACCURACY' placeholder='17%' />

          <Monetization className='py-4' />
        </div>
      </div>

      <PerformanceCard />
      <AccuracyChartCard />
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

export default TechnicalIndicator;
