import type { FC } from 'react';
import { RevenueAndNetProfit } from '../RevenueAndNetProfit';
import FinancialStability from './FinancialStability';
import IncomeAndRevenueHistory from './IncomeAndRevenueHistory';
import DebtsAndAssets from './DebtsAndAssets';
import CashFlow from './CashFlow';
import ROE from './ROE';
import ReturnOnAssets from './ReturnOnAssets';
import { HistoryOfProfit } from './HistoryOfProfit';
import ShareholderStructure from '../ShareholderStructure';
import { RevenueAnalysis } from './RevenueAnalysis';
import { Shareholders } from './Shareholders';
import ReturnOnEquity from './ReturnOnEquity';
import { FundamentalAnalysis } from './FundamentalAnalysis';
import { ProfitGrowtHistory } from './ProfitGrowtHistory';
import { CapitalStructure } from './CapitanStructure';
import { useQuery } from '@tanstack/react-query';
import { StocksService } from '@/services/StocksService';
import { useParams } from 'next/navigation';
import { CashFlowData } from '@/screens/DetailBondsScreen/constants';

export const AdvancedView: FC = () => {
  const { stockName } = useParams<{ stockName: string }>();

  const { data: cashFlow } = useQuery({
    queryKey: ['cash-flow'],
    queryFn: () => StocksService.cashFlow(stockName),
  });

  return (
    <section className='flex flex-col gap-y-6 mt-6'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <FundamentalAnalysis />
        <RevenueAndNetProfit />
      </div>
      <FinancialStability />
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <IncomeAndRevenueHistory />
        <DebtsAndAssets />
      </div>
      <CashFlow data={cashFlow?.data as Record<string, CashFlowData[]> | undefined} />
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <ROE />
        <ReturnOnAssets />
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <ReturnOnEquity />
        <HistoryOfProfit />
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <ProfitGrowtHistory />
        <ShareholderStructure />
      </div>
      <RevenueAnalysis />
      <Shareholders />
      <CapitalStructure />
    </section>
  );
};
