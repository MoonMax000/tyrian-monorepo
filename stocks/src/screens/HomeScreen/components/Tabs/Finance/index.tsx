'use client';
import Paper from '@/components/Paper';
import FinancicalIndicatorChart from './FinancicalIndicatorChart';
import FinanceReportingTable from './FinanceReportingTable';
import { useQuery } from '@tanstack/react-query';
import { StocksService } from '@/services/StocksService';
import { useParams } from 'next/navigation';

const Finance = () => {
  const { stockName } = useParams<{ stockName: string }>();
  const { data } = useQuery({
    queryKey: ['financials'],
    queryFn: () => StocksService.financialStability('us', stockName),
  });

  return (
    <section className='flex flex-col gap-6'>
      <Paper className='!p-0 rounded-3xl border border-regaliaPurple !bg-[#0C101480] backdrop-blur-[100px]'>
        <FinancicalIndicatorChart />
      </Paper>
      <Paper className='!p-0 mt-12 !bg-[#0C101480] backdrop-blur-[100px] rounded-3xl border border-regaliaPurple'>
        <FinanceReportingTable />
      </Paper>
    </section>
  );
};

export default Finance;
