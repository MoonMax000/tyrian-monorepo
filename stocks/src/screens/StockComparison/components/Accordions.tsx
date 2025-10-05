import AccordionItem from '@/components/UI/AccordionItem';
import React from 'react';
import ProfitAndLossStatement from './ProfitAndLossStatement';

const mockData = [
  { title: 'Stock Price Dynamics', content: '' },
  { title: 'Income Statement', content: <ProfitAndLossStatement /> },
  { title: 'Balance Sheet', content: '' },
  { title: 'Cash Flow Investment', content: '' },
  { title: 'Valuation Multiples', content: '' },
  { title: 'Margin', content: '' },
  { title: 'Profit', content: '' },
  { title: 'Yield', content: '' },
  { title: 'Ownership', content: '' },
];

const Accordions = () => {
  return (
    <section className='flex flex-col gap-6 mt-4'>
      {mockData.map((item, index) => (
        <div key={index}>
          <AccordionItem variant='v2' item={item} className='!px-0' titleWrapperClassName='px-6' />
        </div>
      ))}
    </section>
  );
};

export default Accordions;
