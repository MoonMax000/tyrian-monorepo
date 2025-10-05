'use client';

import { useState, type FC } from 'react';
import YearDiagram from '@/components/Diagrams/YearDiagram';
import Filter from '@/components/UI/Filter';

const years = [
  { name: '1D', key: 'one_day' },
  { name: '1M', key: 'one_month' },
  { name: '6M', key: 'six_months' },
  { name: '1Y', key: 'one_year' },
  { name: '5Y', key: 'five_years' },
  { name: 'ALL', key: 'all' },
];

const mockDiagramData = [
  { month: 'FEB', price: 70 },
  { month: 'MAR', price: 90 },
  { month: 'APR', price: 120 },
  { month: 'MAY', price: 150 },
  { month: 'JUN', price: 154 },
  { month: 'JULY', price: 149 },
  { month: 'AUG', price: 153 },
  { month: 'SEP', price: 158 },
  { month: 'OCT', price: 170 },
  { month: 'NOV', price: 190 },
  { month: 'DEC', price: 220 },
  { month: 'JAN', price: 254 },
];

export const CommoditiesDiagram: FC = () => {
  const [activeYear, setActiveYear] = useState<string>(years[2].key);

  return (
    <>
      <div className='flex justify-between flex-col sm:flex-row sm:items-center gap-2 px-6'>
        <Filter
          className='!p-0 ml-auto'
          options={years}
          active={activeYear}
          onChange={setActiveYear}
        />
      </div>

      <YearDiagram
        id='commodities-diagram'
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
