import ContentWrapper from '@/components/UI/ContentWrapper';
import { FC, useState, useMemo } from 'react';
import LegendIcon from '@/assets/icons/circleWithLine.svg';
import clsx from 'clsx';
import DebtsAndAssetsDiagram from '@/components/Diagrams/DebtsAndAssetsDiagram';
import { useQuery } from '@tanstack/react-query';
import { StocksService } from '@/services/StocksService';
import { usePathname } from 'next/navigation';
import { debtsAssetsMockData } from '../constants';
import Loaders from '@/components/UI/Skeleton';

interface Filter {
  name: React.ReactNode;
  key: string;
}

const filters: Filter[] = [
  { name: <>Y</>, key: 'y' },
  { name: <>Q</>, key: 'q' },
];

interface FilterButtonProps {
  activeKey: string;
  filter: Filter;
  setActiveKey: (key: string) => void;
}

const FilterButton: FC<FilterButtonProps> = ({ activeKey, filter, setActiveKey }) => (
  <button
    type='button'
    className={clsx(
      'px-4 h-[32px] rounded-[4px] transition-colors text-body-15 font-bold text-white items-center flex justify-center',
      {
        'bg-purple': activeKey === filter.key,
        'bg-[#FFFFFF0A] opacity-45': activeKey !== filter.key,
      },
    )}
    onClick={() => setActiveKey(filter.key)}
  >
    {filter.name}
  </button>
);

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

export interface IDebtsAndAssets {
  date: string;
  assets: number;
  liabilities: number;
  debt: number;
  procent: number;
}

const DebtsAndAssets: FC = () => {
  const [activeKey, setActiveKey] = useState(filters[0].key);
  const pathname = usePathname();
  const ticker = pathname.split('/').pop() || '';

  const initColors = ['#A06AFF', '#6AA5FF', '#FFA800'];

  const legnd = [
    {
      title: 'Assets',
      icon: <div className='w-3 h-3 rounded-full' style={{ backgroundColor: initColors[0] }}></div>,
    },
    {
      title: 'laibilities',
      icon: <div className='w-3 h-3 rounded-full' style={{ backgroundColor: initColors[1] }}></div>,
    },
    {
      title: 'Debts',
      icon: <LegendIcon color={initColors[2]} width={14} height={8} />,
    },
  ];

  const {
    data: debtsAssetsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['debtsAssets', ticker],
    queryFn: () => StocksService.debtsAssets(ticker),
    staleTime: 60000,
    enabled: !!ticker,
  });

  const transformedData = useMemo<IDebtsAndAssets[]>(() => {
    if (!debtsAssetsData?.data) {
      return debtsAssetsMockData
        .map((item) => ({
          date: item.date.split('-')[0], // Оставляем только год (если что можно изменить)
          assets: item.totalAssets,
          liabilities: item.totalLiabilities,
          debt: item.totalDebt,
          procent: (item.netDebt / item.totalAssets) * 100,
        }))
        .reverse();
    }

    return debtsAssetsData.data
      .map((item) => ({
        date: item.date.split('-')[0], // Оставляем только год (если что можно изменить)
        assets: item.totalAssets,
        liabilities: item.totalLiabilities,
        debt: item.totalDebt,
        procent: (item.netDebt / item.totalAssets) * 100,
      }))
      .reverse();
  }, [debtsAssetsData?.data]);

  return (
    <>
      {false ? (
        <Loaders className='w-full h-full' />
      ) : (
        <ContentWrapper className='px-4 py-6'>
          <div className='flex justify-between text-body-15 mb-4'>
            <h3 className='text-white text-[24px] font-bold'>Debts & Assets</h3>
            {renderFilterButtons(activeKey, setActiveKey)}
          </div>
          <div className='flex justify-between text-[15px] font-bold text-white'>
            <span>laibilities</span>
            <span>Debts</span>
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
            <DebtsAndAssetsDiagram height={250} width='100%' data={transformedData} />
          )}

          <div className='flex justify-center items-center gap-4 mt-4'>
            {legnd.map((el) => (
              <div key={el.title} className='justify-between flex gap-[7px] items-center'>
                <div>{el.icon}</div>
                <p className='uppercase text-[12px] text-grayLight font-bold'>{el.title}</p>
              </div>
            ))}
          </div>
        </ContentWrapper>
      )}
    </>
  );
};

export default DebtsAndAssets;
