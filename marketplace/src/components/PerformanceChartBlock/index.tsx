import React, { FC } from 'react';
import YearDiagram from '../UI/PerformanceChart';

export const mockDiagramData = [
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

interface Props {
  title: string;
}

export const PerformanceChartBlock: FC<Props> = ({ title }) => {
  return (
    <div className=' w-full bg-[#0C101480] backdrop-blur-[100px] border border-[#523A83] rounded-3xl'>
      <div className='w-full min-h-[58px] border-b border-[#2E2744] p-4 text-purple text-[19px] font-bold'>
        {title}
      </div>
      <YearDiagram
        id='performance'
        colors={['#A06AFF52', '#181A2000']}
        yAxisDx={0}
        yAxisDy={0}
        margin={{
          top: 20,
          right: -20,
          bottom: 20,
          left: 0,
        }}
        className='!h-[260px] !w-full px-4'
        data={mockDiagramData}
      />
    </div>
  );
};
