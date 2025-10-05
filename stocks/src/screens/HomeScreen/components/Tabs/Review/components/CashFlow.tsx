'use client';
import LineDiagram, { LineConfig, ServerData } from '@/components/Diagrams/LineDiagram';
import clsx from 'clsx';
import ContentWrapper from '@/components/UI/ContentWrapper';
import { FC, useMemo } from 'react';
import LegendIcon from '@/assets/icons/circleWithLine.svg';
import { usePathname } from 'next/navigation';
import Loaders from '@/components/UI/Skeleton';
import {
  CashFlowData,
  cashFlowData as cashFlowMockData,
} from '@/screens/DetailBondsScreen/constants';
import QuestionIcon from '@/assets/icons/question.svg';

interface Props {
  data?: Record<string, CashFlowData[]>;
  title?: string;
  className?: string;
}

const CashFlow: FC<Props> = ({ data: cashFlowData, className, title }) => {
  const lineConfigs: { [key: string]: LineConfig } = {
    line1: {
      color: '#FFA800',
      dotColor: '#FFA800',
    },
    line2: {
      dotColor: '#A06AFF',
      color: '#A06AFF',
    },
    line3: {
      dotColor: '#6AA5FF',
      color: '#6AA5FF',
    },
  };

  const legnd = [
    { color: '#FFA800', title: 'Operating cash flow' },
    { color: '#A06AFF', title: 'investing cash flow' },
    { color: '#6AA5FF', title: 'financing cash flow' },
  ];

  const pathname = usePathname();
  const ticker = pathname.split('/').pop() || '';

  // const {
  //   data: cashFlowData,
  //   isLoading,
  //   error,
  // } = useQuery({
  //   queryKey: ['cashFlow', ticker],
  //   queryFn: () => StocksService.cashFlow(ticker),
  //   staleTime: 60000,
  //   enabled: !!ticker,
  // }); // пока апи нет

  const transformedData = useMemo<ServerData>(() => {
    if (!cashFlowData?.data) {
      return {
        line1: cashFlowMockData.data.map((item) => ({
          datetime: item.date,
          value: item.netCashProvidedByOperatingActivities,
        })),
        line2: cashFlowMockData.data.map((item) => ({
          datetime: item.date,
          value: item.netCashUsedForInvestingActivites,
        })),
        line3: cashFlowMockData.data.map((item) => ({
          datetime: item.date,
          value: item.netCashUsedProvidedByFinancingActivities,
        })),
      };
    }

    return {
      line1: cashFlowData.data.map((item) => ({
        datetime: item.date,
        value: item.netCashProvidedByOperatingActivities,
      })),
      line2: cashFlowData.data.map((item) => ({
        datetime: item.date,
        value: item.netCashUsedForInvestingActivites,
      })),
      line3: cashFlowData.data.map((item) => ({
        datetime: item.date,
        value: item.netCashUsedProvidedByFinancingActivities,
      })),
    };
  }, [cashFlowData?.data]);

  return (
    <>
      {false ? (
        <Loaders className='w-full h-[293px]' />
      ) : (
        <ContentWrapper className={clsx(className, 'py-6 px-4')}>
          <div className='flex items-center gap-x-[6px]'>
            <h3 className='text-h4'>{title ?? 'Cash Flow'}</h3>
            <button className='text-grayLight hover:text-white'>
              <QuestionIcon width={20} height={20} />
            </button>
          </div>

          {false ? (
            <div className='h-[293px] w-full rounded-lg mt-6 opacity-40 text-white'>
              {/* Ошибка: {error.message} */}
            </div>
          ) : cashFlowData?.data?.length === 0 ? (
            <div className='h-[293px] w-full rounded-lg mt-6 opacity-40 text-white flex items-center justify-center'>
              ДАННЫХ НЕТ
            </div>
          ) : (
            <LineDiagram
              height={293}
              width='100%'
              className='mt-6'
              serverData={transformedData}
              lineConfigs={lineConfigs}
            />
          )}

          <div className='flex items-center justify-center gap-4 mt-4'>
            {legnd.map((el) => (
              <div
                key={'cash-flow-' + el.color}
                className='items-center justify-between flex gap-[7px]'
              >
                <LegendIcon color={el.color} width={14} height={8} />
                <p className='uppercase text-[12px] font-bold text-grayLight'>{el.title}</p>
              </div>
            ))}
          </div>
        </ContentWrapper>
      )}
    </>
  );
};

export default CashFlow;
