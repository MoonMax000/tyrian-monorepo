import React, { FC } from 'react';
import { SimpleBarChart } from '../UI/SimpleBarChart';

export interface AccuracyChart {
  name: string;
  UNSUCCESSFUL: number;
  SUCCESSFUL: number;
  amt: number;
}

export const mockBarChartData: AccuracyChart[] = [
  {
    name: 'JAN',
    UNSUCCESSFUL: 3200,
    SUCCESSFUL: 2100,
    amt: 1800,
  },
  {
    name: 'FEB',
    UNSUCCESSFUL: 2800,
    SUCCESSFUL: 1800,
    amt: 2000,
  },
  {
    name: 'MAR',
    UNSUCCESSFUL: 3500,
    SUCCESSFUL: 2200,
    amt: 1900,
  },
  {
    name: 'APR',
    UNSUCCESSFUL: 4000,
    SUCCESSFUL: 2400,
    amt: 2400,
  },
  {
    name: 'MAY',
    UNSUCCESSFUL: 3000,
    SUCCESSFUL: 1398,
    amt: 2210,
  },
  {
    name: 'JUN',
    UNSUCCESSFUL: 2000,
    SUCCESSFUL: 9800,
    amt: 2290,
  },
  {
    name: 'JUL',
    UNSUCCESSFUL: 2780,
    SUCCESSFUL: 3908,
    amt: 2000,
  },
  {
    name: 'AUG',
    UNSUCCESSFUL: 1890,
    SUCCESSFUL: 4800,
    amt: 2181,
  },
  {
    name: 'SEP',
    UNSUCCESSFUL: 2390,
    SUCCESSFUL: 3800,
    amt: 2500,
  },
  {
    name: 'OCT',
    UNSUCCESSFUL: 3490,
    SUCCESSFUL: 4300,
    amt: 2100,
  },
  {
    name: 'NOV',
    UNSUCCESSFUL: 4200,
    SUCCESSFUL: 5200,
    amt: 2300,
  },
  {
    name: 'DEC',
    UNSUCCESSFUL: 3800,
    SUCCESSFUL: 6100,
    amt: 2800,
  },
];

interface Props {
  title: string;
}

export const AccuracyChartBlock: FC<Props> = ({ title }) => {
  return (
    <div className=' w-full bg-[#0C101480] backdrop-blur-[100px] border border-[#523A83] rounded-3xl'>
      <div className='w-full min-h-[58px] border-b border-[#2E2744] p-4 text-purple text-[19px] font-bold'>
        {title}
      </div>
      <SimpleBarChart data={mockBarChartData} />
    </div>
  );
};
