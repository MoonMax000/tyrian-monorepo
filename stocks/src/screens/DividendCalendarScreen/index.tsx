'use client';

import Container from '@/components/UI/Container';
import CalendarTable from './components/CalendarTable';
import { FAQ } from '@/components/FAQ';
import { CryptoCurrencyBackground } from '@/components/Backgrounds';
import { FAQItems } from './constants';

const DividendCalendarScreen = () => {
  return (
    <Container>
      <CryptoCurrencyBackground />
      <h1 className='text-[31px] font-bold mb-[32px]'>Dividend Calendar 2024</h1>
      <CalendarTable />
      <FAQ items={FAQItems} className='my-10 lg:my-[138px]' />
    </Container>
  );
};

export default DividendCalendarScreen;
