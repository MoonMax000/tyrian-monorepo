'use client';

import Paper from '@/components/Paper';
import EconomicIndicatorsSlider from './EconomicIndicatorsSlider';
import clsx from 'clsx';
import { useState } from 'react';
import AreaDiagram from '@/components/Diagrams/AreaDiagram';

const years = [
  { name: '1Y', key: 'one_year' },
  { name: '5Y', key: 'five_years' },
  { name: '10Y', key: 'ten_years' },
  { name: 'ALL', key: 'all' },
];

const graphicData = [
  { date: '2013', price: 2200 },
  { date: '2014', price: 2020 },
  { date: '2015', price: 1400 },
  { date: '2016', price: 1350 },
  { date: '2017', price: 1500 },
  { date: '2018', price: 1600 },
  { date: '2019', price: 1650 },
  { date: '2020', price: 1450 },
  { date: '2021', price: 1800 },
  { date: '2022', price: 2180 },
  { date: '2023', price: 1950 },
];

const areaDiagramSettings = {
  margin: {
    top: 20,
    right: -20,
    bottom: 20,
    left: 0,
  },
  colors: ['transparent', 'transparent'] as [string, string],
};

const MainEconomicIndicators = () => {
  const [activeYear, setActiveYear] = useState<string>(years[0].key);

  return (
    <Paper className='!p-0 bg-blackedGray'>
      <div className='border-b-[2px] border-onyxGrey pb-6'>
        <div className='flex items-center justify-between p-6 pb-8'>
          <h4 className='text-h4'>Key Economic Indicators</h4>
          <div className='flex items-center gap-2'>
            {years.map((year) => (
              <button
                type='button'
                key={year.key}
                className={clsx('px-2 py-[10px] rounded-[4px] transition-colors', {
                  'bg-purple opacity-100': activeYear === year.key,
                  'bg-[#FFFFFF0A] opacity-48': activeYear !== year.key,
                })}
                onClick={() => setActiveYear(year.key)}
              >
                {year.name}
              </button>
            ))}
          </div>
        </div>

        <AreaDiagram
          id='main-economic-indicators'
          data={graphicData}
          className='min-h-[250px] px-6'
          dot
          yAxisDx={0}
          yAxisDy={0}
          {...areaDiagramSettings}
        />
      </div>

      <EconomicIndicatorsSlider />
    </Paper>
  );
};

export default MainEconomicIndicators;
