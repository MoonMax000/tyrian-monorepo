'use client';

import Paper from '@/components/Paper';
import IconCalendar from '@/assets/icons/calendar.svg';
import AreaDiagramWithThreeArea, { DataItem } from '@/components/Diagrams/AreaDiagramWithThreeArea';
import DataTable from './DataTable';

const mockDiagramData: DataItem[] = [
  {
    date: '1Y',
    currentPercent: 19,
    percentOneMonthAgo: 18,
    percentOneYearAgo: 16.5,
  },
  {
    date: '2Y',
    currentPercent: 18.5,
    percentOneMonthAgo: 17.75,
    percentOneYearAgo: 15.25,
  },
  {
    date: '3Y',
    currentPercent: 18,
    percentOneMonthAgo: 17.7,
    percentOneYearAgo: 14.95,
  },
  {
    date: '5Y',
    currentPercent: 18,
    percentOneMonthAgo: 17.25,
    percentOneYearAgo: 14.1,
  },
  {
    date: '7Y',
    currentPercent: 17.75,
    percentOneMonthAgo: 16.9,
    percentOneYearAgo: 13.9,
  },
  {
    date: '10Y',
    currentPercent: 17.25,
    percentOneMonthAgo: 16.5,
    percentOneYearAgo: 13.7,
  },
  {
    date: '15Y',
    currentPercent: 17.1,
    percentOneMonthAgo: 16.05,
    percentOneYearAgo: 13.2,
  },
  {
    date: '20Y',
    currentPercent: 16.8,
    percentOneMonthAgo: 15.9,
    percentOneYearAgo: 13,
  },
];

const BondsYields = () => {
  return (
    <Paper className='!p-0'>
      <div className='flex justify-end items-center gap-6 p-6'>
        <div className='bg-purple flex items-center gap-2 p-2 text-body-12 rounded-[4px]'>
          <p>LAST YEAR</p>
          <span>+2.02%</span>
        </div>
        <div className='py-[6px] px-3 rounded-[4px] opacity-48 bg-[#FFFFFF0A]'>
          <IconCalendar />
        </div>
      </div>

      <AreaDiagramWithThreeArea className='min-h-[250px] px-6 pl-0' data={mockDiagramData} />

      <div className='mt-6'>
        <DataTable />
      </div>
    </Paper>
  );
};

export default BondsYields;
