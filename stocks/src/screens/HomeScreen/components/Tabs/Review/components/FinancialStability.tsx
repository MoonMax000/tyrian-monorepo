import ContentWrapper from '@/components/UI/ContentWrapper';
import { FC, JSX, useEffect, useMemo, useState } from 'react';
import QuestionIcon from '@/assets/icons/question.svg';
import LevelAndCoverage from '@/components/Diagrams/DebtLevelAndCoverage';
import AnalysisOfFinancialSituation from '@/components/Diagrams/AnalysisOfFinancialSituation';
import FilterButton from '@/components/UI/FilterButton';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { StocksService } from '@/services/StocksService';
import { debtAndCoverageMockData, financialAnalysisMockData } from '../constants';
import Loaders from '@/components/UI/Skeleton';

export interface IDebtLevel {
  date: string;
  movementOfFunds: number;
  debt?: number;
  сash: number;
}

const initColors = ['#FFA800', '#A06AFF', '#6AA5FF'];

interface Filter {
  name: React.ReactNode;
  key: string;
}

const filters: Filter[] = [
  { name: <>Y</>, key: 'y' },
  { name: <>Q</>, key: 'q' },
];

interface LegendItem {
  title: string;
}

const createLegend = (items: LegendItem[], colors: string[]): JSX.Element[] =>
  items.map((el, index) => (
    <div key={el.title} className='justify-between items-center flex gap-[7px]'>
      <div className='w-3 h-3 rounded-full' style={{ backgroundColor: colors[index] }}></div>
      <p className='uppercase text-grayLight text-[12px] font-bold'>{el.title}</p>
    </div>
  ));

const LegendCoverage: FC = () =>
  createLegend(
    [{ title: 'DEBT' }, { title: 'CASH FLOW' }, { title: 'CASH & CASH Equivalents' }],
    initColors,
  );

const LegendProvisions: FC = () =>
  createLegend([{ title: 'Assets' }, { title: 'laibilities' }], initColors.slice(1));

interface FinancialStabilityState {
  debt: string;
  provisions: string;
}

const FinancialStability: FC = () => {
  const { stockName } = useParams<{ stockName: string }>();
  const [activeKeys, setActiveKeys] = useState<FinancialStabilityState>({
    debt: filters[0].key,
    provisions: filters[0].key,
  });

  const updateActiveKey = (keyType: 'debt' | 'provisions', key: string) => {
    setActiveKeys((prevKeys) => ({
      ...prevKeys,
      [keyType]: key,
    }));
  };

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

  const { data, isLoading, error } = useQuery({
    queryKey: ['incomeAndRevenue', stockName],
    queryFn: () => StocksService.financialStability('us', stockName),
    staleTime: 60000,
    enabled: !!stockName,
  });
  useEffect(() => {
    console.log('alalaallolo', data);
  }, [data]);

  const levelAndCoverageData = useMemo<IDebtLevel[]>(() => {
    if (!data?.data || !Array.isArray(data?.data.depbts_and_coverage)) {
      return debtAndCoverageMockData
        .map((item) => ({
          date: item.date.split('-')[0],
          debt: item.totalLiabilities,
          movementOfFunds: item.totalAssets,
          сash: item.cashAndCashEquivalents,
          revenue: 0,
        }))
        .reverse();
    }

    return data.data.depbts_and_coverage
      .map((item) => ({
        date: item.date.split('-')[0],
        debt: item.totalLiabilities,
        movementOfFunds: item.totalAssets,
        сash: item.cashAndCashEquivalents,
        revenue: 0,
      }))
      .reverse();
  }, [data?.data]);

  const financeSituatuonData = useMemo<IDebtLevel[]>(() => {
    // if (!data?.data.financial_analysis) return [];

    const data = {
      data: {
        financial_analysis: financialAnalysisMockData,
      },
    };

    return [
      {
        date: 'Short-term',
        movementOfFunds: data.data.financial_analysis.totalCurrentAssets,
        сash: data.data.financial_analysis.totalCurrentLiabilities,
      },
      {
        date: 'long-term',
        movementOfFunds: data.data.financial_analysis.totalNonCurrentAssets,
        сash: data.data.financial_analysis.totalNonCurrentLiabilities,
      },
    ];
  }, [data?.data]);

  return (
    <>
      {isLoading ? (
        <Loaders className='w-full h-[417px]' />
      ) : (
        <ContentWrapper>
          <div className='px-[23px] pt-6 pb-4 border-b-2 border-gunpowder'>
            <h3 className='text-[24px] font-bold text-white'>Financial Stability</h3>
            <p className='text-[15px] font-bold text-grayLight'>
              Financial position & Company solvency
            </p>
          </div>
          <div className='p-6 grid items-center justify-between grid-cols-1 lg:grid-cols-2'>
            <div className='mb-4 lg:mb-0 pb-4 lg:pb-0 border-b-2 lg:border-b-0 lg:border-r-2 border-gunpowder pr-6'>
              <div className='flex justify-between text-body-15'>
                <div className='flex items-center gap-[6px]'>
                  <span className='text-[19px] font-bold text-white'>
                    Debt level and coverage ratio
                  </span>
                  <button className='text-grayLight hover:text-white'>
                    <QuestionIcon />
                  </button>
                </div>
                {renderFilterButtons(activeKeys.provisions, (key) =>
                  updateActiveKey('provisions', key),
                )}
              </div>
              {
                /*{error ? (
              <div className='h-[293px] w-full rounded-lg mt-6 opacity-40 text-white'>
                Ошибка: {error.message}
              </div>
            ) : }*/ levelAndCoverageData?.length === 0 ? (
                  <div className='h-[293px] w-full rounded-lg mt-6 opacity-40 text-white flex items-center justify-center'>
                    ДАННЫХ НЕТ
                  </div>
                ) : (
                  <>
                    <LevelAndCoverage height={193} width='100%' data={levelAndCoverageData} />
                    <div className='w-full max-w-[366px] mx-auto flex items-center justify-between gap-4 mt-4'>
                      <LegendCoverage />
                    </div>
                  </>
                )
              }
            </div>
            <div className='pl-6'>
              <div className='flex justify-between text-body-15'>
                <div className='flex items-center gap-[6px]'>
                  <span className='text-[19px] font-bold text-white'>
                    Financial postion analysis
                  </span>
                  <button className='text-grayLight hover:text-white'>
                    <QuestionIcon />
                  </button>
                </div>
                {renderFilterButtons(activeKeys.debt, (key) => updateActiveKey('debt', key))}
              </div>

              {false ? (
                <div className='h-[293px] w-full rounded-lg mt-6 opacity-40 text-white'>
                  Ошибка: {error?.message}
                </div>
              ) : levelAndCoverageData?.length === 0 ? (
                <div className='h-[293px] w-full rounded-lg mt-6 opacity-40 text-white flex items-center justify-center'>
                  ДАННЫХ НЕТ
                </div>
              ) : (
                <>
                  <AnalysisOfFinancialSituation
                    height={193}
                    width='100%'
                    data={financeSituatuonData}
                  />
                  <div className='w-full max-w-[213px] mx-auto flex items-center justify-between gap-4 mt-4'>
                    <LegendProvisions />
                  </div>
                </>
              )}
            </div>
          </div>
        </ContentWrapper>
      )}
    </>
  );
};

export default FinancialStability;
