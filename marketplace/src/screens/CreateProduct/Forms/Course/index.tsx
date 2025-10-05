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

const Course: FC = () => {
  return (
    <div className='flex flex-col gap-6 pb-60'>
      <div className='z-[100] custom-bg-blur border border-regaliaPurple rounded-[24px]'>
        <Head hideRisk />
        <div className='p-4 flex flex-col gap-4'>
          <Input label='Product’s title' />

          <UploadComponent />
          <UploadComponent title='Upload accompanying video' />

          <Input label='DURATION' placeholder='15h' />
          <Input
            label='MATERIALS & QUANTITIES'
            placeholder='5 videos, 17 lectures, 2 masterclasses, etc...'
          />
          <Input label='LEVEL' placeholder='Begginer, Advanced, Pro, All levels' />
          <Input label='ADDITIONAL TAGS' placeholder='automation, risk_managment, etc...' />

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

export default Course;
