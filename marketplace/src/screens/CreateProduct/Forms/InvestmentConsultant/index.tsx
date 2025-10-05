'use client';
import { FC } from 'react';
import { Selector } from '../../components/Selector';
import Head from '../../components/Head';
import Input from '../../components/Input';
import UploadComponent from '../../components/Upload';
import SpecificationsCard from '../../components/Cards/SpecificationsCard';
import DescriptionCard from '../../components/Cards/DescriptionCard';
import Footer from '../../components/Footer';

import { PriceList } from './PriceList';
import CreateProductLayout from '../../Layout';

const InvestmentConsultant: FC = () => {
  return (
    <div className='flex flex-col gap-6 pb-60'>
      <div className='z-[100] custom-bg-blur border border-regaliaPurple rounded-[24px]'>
        <Head hideRisk />
        <div className='p-4 flex flex-col gap-4'>
          <UploadComponent title='Upload cover image' />
          <Input label='Company' />
          <UploadComponent title='Upload accompanying video' />

          <Input label='LOCATION' placeholder='RF, Saint-Petresburg' />
          <Input label='ADDITIONAL LOCATION' placeholder='RF, Moscow' />
          <Input
            label='PROFESSIONAL DESIGNATIONS'
            placeholder='Certified plan fiduciary advisor (CPFA)'
          />

          <PriceList className='py-4' />
        </div>
      </div>
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

export default InvestmentConsultant;
