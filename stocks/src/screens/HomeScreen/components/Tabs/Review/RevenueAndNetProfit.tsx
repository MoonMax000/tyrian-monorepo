import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { StocksService } from '@/services/StocksService';
import RevenueAndNetProfitDiagram, {
  IRevenueAndNetProfitEl,
} from '@/components/Diagrams/RevenueAndNetProfitDiagram';
import ContentWrapper from '@/components/UI/ContentWrapper';
import QuestionIcon from '@/assets/icons/question.svg';

export const RevenueAndNetProfit = () => {
  const pathname = usePathname();
  const ticker = pathname.split('/').pop() || '';
  const {
    data: revenueAndNetProfitData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['revenueAndNetProfit', ticker],
    queryFn: () => StocksService.revenueNetProfit('us', ticker),
    staleTime: 60000,
    enabled: !!ticker,
  });

  const transformedData = useMemo<IRevenueAndNetProfitEl[]>(() => {
    if (!revenueAndNetProfitData?.data) return [];

    return revenueAndNetProfitData.data
      .map((item) => ({
        name: item.date.split('-')[0],
        netIncome: item.netIncome >= 0 ? item.netIncome : 0,
        revenue: item.revenue >= 0 ? item.revenue : 0,
      }))
      .reverse();
  }, [revenueAndNetProfitData?.data]);

  return (
    <ContentWrapper>
      <div className='flex items-center gap-x-[6px] pt-6 px-4 pb-4 border-b-[1px] border-b-regaliaPurple'>
        <h2 className='text-white font-bold text-[24px]'>Revenue & Net profit</h2>
        <button className='text-grayLight hover:text-white'>
          <QuestionIcon />
        </button>
      </div>
      <RevenueAndNetProfitDiagram data={transformedData} height={300} />
      <div className='py-6 px-4'>
        <div className='flex items-center text-[12px] font-bold uppercase text-grayLight justify-center gap-x-4'>
          <div className='flex items-center gap-2'>
            <span className='w-4 h-4 rounded-full bg-[#a78bfa]' />
            Revenue
          </div>
          <div className='flex items-center gap-2'>
            <span className='w-4 h-4 rounded-full bg-[#facc15]' />
            Net Profit
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};
