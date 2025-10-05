import Paper from '@/components/Paper';
import React, { useState, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { IQuotationChartEl } from '@/screens/HomeScreen/components/Tabs/Review/components/QuotationDiagram';
import ButtonTag from '@/screens/EventsCalendarScreen/components/ButtonTag';
import { yearFiltersArray } from './constants';
import { StocksService } from '@/services/StocksService';
import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import QuotationDiagram from '@/screens/HomeScreen/components/Tabs/Review/components/QuotationDiagram';
import Loaders from '@/components/UI/Skeleton';

const getDateRange = (filter: string) => {
  const end = new Date();
  let start = new Date();

  if (filter === 'max') {
    start = new Date(2010, 0, 1);
  } else if (filter === 'five_years') {
    start.setFullYear(end.getFullYear() - 5);
  } else {
    start.setFullYear(end.getFullYear() - 1);
  }

  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  };
};

const QuotationChart = () => {
  const [activeYearFilter, setActiveYearFilter] = useState<string>(yearFiltersArray[0].key);
  const pathname = usePathname();
  const ticker = pathname.split('/').pop() || '';

  const { startDate, endDate } = useMemo(() => getDateRange(activeYearFilter), [activeYearFilter]);

  const {
    data: quotationChartData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['quotationChart', ticker, startDate, endDate],
    queryFn: () => StocksService.quotationChart({ ticker, start: startDate, end: endDate }),
    staleTime: 60000,
    enabled: !!ticker,
  });

  const transformedData = useMemo<IQuotationChartEl[]>(() => {
    if (!quotationChartData?.data) return [];

    return quotationChartData.data
      .map((item) => ({
        date: item.date.split('-')[0],
        revenue: item.revenue,
        ebitda: item.ebitda,
        netIncome: item.netIncome,
        freeCashFlow: item.freeCashFlow,
        totalLiabilities: item.totalLiabilities,
      }))
      .reverse();
  }, [quotationChartData?.data]);

  useEffect(() => {
    console.log('Current filter:', activeYearFilter);
  }, [activeYearFilter]);

  return (
    <>
      {isLoading ? (
        <Loaders className='w-full h-[528px]' />
      ) : (
        <Paper>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-h4'>Stock Price Chart</h3>
            <div className='flex items-center gap-3'>
              {yearFiltersArray.map((filter) => (
                <button
                  key={filter.key}
                  type='button'
                  className={clsx(
                    'rounded-[4px] text-body-12 transition-colors  px-[9.5px] h-[32px] w-fit',
                    {
                      'bg-purple': activeYearFilter === filter.key,
                      'bg-[#FFFFFF0A] opacity-45': activeYearFilter !== filter.key,
                    },
                  )}
                  onClick={() => setActiveYearFilter(filter.key)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {error ? (
            <div className='h-[372px] w-full rounded-lg mt-6 opacity-40 text-white'>
              Ошибка: {error.message}
            </div>
          ) : quotationChartData?.data?.length === 0 ? (
            <div className='h-[372px] w-full rounded-lg mt-6 opacity-40 text-white flex items-center justify-center'>
              ДАННЫХ НЕТ
            </div>
          ) : (
            <QuotationDiagram
              id='stock-price-chart'
              data={transformedData}
              className='max-h-[372px]'
            />
          )}

          <div className='px-6 pt-6 pb-4 w-full flex items-center justify-center gap-2'>
            <ButtonTag fillCircle={true} text={'Revenue'} color={'#6AA6FF'} />
            <ButtonTag fillCircle={true} text={'EBITDA'} color={'#FFB46A'} />
            <ButtonTag fillCircle={true} text={'Net Profitь'} color={'#A06AFF'} />
            <ButtonTag fillCircle={true} text={'FCF'} color={'#6AFF9C'} />
            <ButtonTag fillCircle={true} text={'Debt Obligations'} color={'#FF6A79'} />
          </div>
        </Paper>
      )}
    </>
  );
};

export default QuotationChart;
