'use client';

import AreaDiagram from '@/components/Diagrams/AreaDiagram';
import Filter from '@/components/UI/Filter';
import { useState } from 'react';

const years = [
  { name: '1D', key: 'one_day' },
  { name: '1M', key: 'one_month' },
  { name: '6M', key: 'six_months' },
  { name: '1Y', key: 'one_year' },
  { name: '5Y', key: 'five_years' },
  { name: 'ALL', key: 'all' },
];

const mockDiagramData = [
  { date: '13:00', price: 2500 },
  { date: '14:00', price: 2620 },
  { date: '15:00', price: 2620 },
  { date: '16:00', price: 2580 },
  { date: '17:00', price: 2630 },
  { date: '18:00', price: 2530 },
  { date: '19:00', price: 2400 },
  { date: '20:00', price: 2600 },
  { date: '21:00', price: 2620 },
  { date: '22:00', price: 2650 },
  { date: '23:00', price: 2830 },
  { date: '00:00', price: 2800 },
];

const IndexesDiagram = () => {
  const [activeYear, setActiveYear] = useState<string>(years[2].key);

  return (
    <>
      <div className='flex justify-end items-center gap-2 px-6'>
        <Filter className='!p-0' options={years} active={activeYear} onChange={setActiveYear} />
      </div>

      <AreaDiagram
        id='indexes-diagram'
        data={mockDiagramData}
        className='min-h-[350px] px-6'
        strokeColor='#A06AFF'
        colors={['#A06AFF52', '#181A2000']}
        yAxisDx={0}
        yAxisDy={0}
        margin={{
          top: 20,
          right: -20,
          bottom: 20,
          left: 0,
        }}
      />
    </>
  );
};

export default IndexesDiagram;
