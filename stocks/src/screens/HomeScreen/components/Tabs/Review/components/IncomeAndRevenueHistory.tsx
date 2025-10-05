import ContentWrapper from '@/components/UI/ContentWrapper';
import { FC, useState, useMemo } from 'react';
import LegendIcon from '@/assets/icons/circleWithLine.svg';
import IncomeAndRevenueHistoryDiagram from '@/components/Diagrams/IncomeAndRevenueHistoryDiagram';
import FilterButton, { Filter } from '@/components/UI/FilterButton';
import { useQuery } from '@tanstack/react-query';
import { StocksService } from '@/services/StocksService';
import { usePathname } from 'next/navigation';
import { incomeAndRevenueHistoryMockData } from '../constants';
import Loaders from '@/components/UI/Skeleton';

const filters: Filter[] = [
  { name: <>Y</>, key: 'y' },
  { name: <>Q</>, key: 'q' },
];

const renderFilterButtons = (activeKey: string, setActiveKey: (key: string) => void) => (
  <div className='flex items-center gap-3 flex-wrap'>
    {filters.map((filter) => (
      <FilterButton
        key={filter.key}
        activeKey={activeKey}
        filter={filter}
        setActiveKey={setActiveKey}
      />
    ))}
  </div>
);

export interface IIncomeAndRevenueHistory {
  date: string;
  income: number;
  revenue: number;
  profit: number;
  procent: number;
}

const IncomeAndRevenueHistory: FC = () => {
  const [activeKey, setActiveKey] = useState(filters[0].key);
  const pathname = usePathname();
  const ticker = pathname.split('/').pop() || '';

  const initColors = ['#A06AFF', '#6AA5FF', '#FFA800'];

  const legnd = [
    {
      title: 'Revenue',
      icon: <div className='w-3 h-3 rounded-full' style={{ backgroundColor: initColors[0] }}></div>,
    },
    {
      title: 'income',
      icon: <div className='w-3 h-3 rounded-full' style={{ backgroundColor: initColors[1] }}></div>,
    },
    {
      title: 'profit',
      icon: <LegendIcon color={initColors[2]} width={14} height={8} />,
    },
  ];

  const {
    data: incomeAndRevenueData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['incomeAndRevenueHistory', ticker],
    queryFn: () => StocksService.incomeAndRevenueHistory(ticker),
    staleTime: 60000,
    enabled: !!ticker,
  });

  const transformedData = useMemo<IIncomeAndRevenueHistory[]>(() => {
    if (!incomeAndRevenueData?.data || !Array.isArray(incomeAndRevenueData.data)) {
      return incomeAndRevenueHistoryMockData
        .map((item) => ({
          date: item.date.split('-')[0],
          income: item.netIncome,
          revenue: item.revenue,
          profit: item.grossProfit,
          procent: (item.netIncome / item.revenue) * 100,
        }))
        .reverse();
    }

    return incomeAndRevenueData.data
      .map((item) => ({
        date: item.date.split('-')[0],
        income: item.netIncome,
        revenue: item.revenue,
        profit: item.grossProfit,
        procent: (item.netIncome / item.revenue) * 100,
      }))
      .reverse();
  }, [incomeAndRevenueData?.data]);

  return (
    <>
      {false ? (
        <Loaders className='w-full h-[293px]' />
      ) : (
        <ContentWrapper className='py-6 px-4'>
          <div className='flex justify-between text-body-15 mb-4'>
            <h3 className='text-h4'>Income & Revenue history</h3>
            {renderFilterButtons(activeKey, setActiveKey)}
          </div>
          <div className='flex justify-between text-[15px] font-bold text-white'>
            <span>Yield</span>
            <span>Profit</span>
          </div>

          {false ? (
            <div className='h-[293px] w-full rounded-lg mt-6 opacity-40 text-white'>
              Ошибка: {error?.message}
            </div>
          ) : transformedData?.length === 0 ? (
            <div className='h-[293px] w-full rounded-lg mt-6 opacity-40 text-white flex items-center justify-center'>
              ДАННЫХ НЕТ
            </div>
          ) : (
            <IncomeAndRevenueHistoryDiagram height={250} width='100%' data={transformedData} />
          )}

          <div className='flex items-center justify-center gap-4 mt-4'>
            {legnd.map((el) => (
              <div key={el.title} className='justify-between flex gap-[7px] items-center'>
                <div>{el.icon}</div>
                <p className='uppercase text-[12px] font-bold text-grayLight'>{el.title}</p>
              </div>
            ))}
          </div>
        </ContentWrapper>
      )}
    </>
  );
};

export default IncomeAndRevenueHistory;
