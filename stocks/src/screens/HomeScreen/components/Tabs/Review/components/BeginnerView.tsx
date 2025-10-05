import type { FC } from 'react';
import { RevenueAndNetProfit } from '../RevenueAndNetProfit';
import { HistoryOfProfit } from './HistoryOfProfit';
import { RevenueAnalysis } from './RevenueAnalysis';

export const BeginnerView: FC = () => {
  return (
    <section>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 items-start mt-6'>
        <RevenueAndNetProfit />
        <HistoryOfProfit />
      </div>
      <RevenueAnalysis />
    </section>
  );
};
