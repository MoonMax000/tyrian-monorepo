'use client';
import { FC } from 'react';
import Head from '../../components/Head';
import Input from '../../components/Input';
import UploadComponent from '../../components/Upload';
import SpecificationsCard from '../../components/Cards/SpecificationsCard';
import Monetization from '../../components/Monetization';
import DescriptionCard from '../../components/Cards/DescriptionCard';
import Footer from '../../components/Footer';

const Other: FC = () => {
  return (
    <div className='flex flex-col gap-6 pb-60'>
      <div className='z-[100] custom-bg-blur border border-regaliaPurple rounded-[24px]'>
        <Head hideRisk />
        <div className='p-4 flex flex-col gap-4'>
          <Input label='Product’s title' />

          <UploadComponent />

          <Input label='TYPE' placeholder='Manual, Script, etc...' />
          <Input label='INDUSTRY' placeholder='Automation, Crypto, etc...' />
          <Input label='INSTRUCTIONS' placeholder='PDF' />
          <Input label='ADDITIONAL TAGS' placeholder='automation, risk_managment, etc...' />

          <Monetization className='py-4' />
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

export default Other;
