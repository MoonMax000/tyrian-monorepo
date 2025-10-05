'use client';

import { useState, type FC } from 'react';
import YearDiagram from '@/components/Diagrams/YearDiagram';
import Filter from '@/components/UI/Filter';
import ContentWrapper from '@/components/UI/ContentWrapper';
import QuestionIcon from '@/assets/icons/question.svg';
import ModalV2 from '@/components/UI/ModalV2';
import { TradingModalMultipleChart } from './TradingModalMultipleChart';
import { TradingModalSingleChart } from './TradingModalSingleChart';
import { useQuery } from '@tanstack/react-query';
import { StocksService } from '@/services/StocksService';
import { useParams } from 'next/navigation';
import { formatDateToYYYYMMDD, getCorrectDate } from '@/helpers/getCorrectDate';

const years = [
  { name: '1D', key: 'one_day' },
  { name: '1M', key: 'one_month' },
  { name: '6M', key: 'six_months' },
  { name: '1Y', key: 'one_year' },
  { name: '5Y', key: 'five_years' },
  { name: 'ALL', key: 'all' },
];

const mockDiagramData = [
  { month: 'FEB', price: 70 },
  { month: 'MAR', price: 90 },
  { month: 'APR', price: 120 },
  { month: 'MAY', price: 150 },
  { month: 'JUN', price: 154 },
  { month: 'JULY', price: 149 },
  { month: 'AUG', price: 153 },
  { month: 'SEP', price: 158 },
  { month: 'OCT', price: 170 },
  { month: 'NOV', price: 190 },
  { month: 'DEC', price: 220 },
  { month: 'JAN', price: 254 },
];

const viewTypes = [
  { name: 'asset', key: 'asset' },
  { name: 'stock', key: 'stock' },
];

export const TradingDiagram: FC = () => {
  const [activeYear, setActiveYear] = useState<string>(years[2].key);
  const [viewType, setViewType] = useState<string>(viewTypes[0].key);
  const [tradingModalIsOpen, setTradingModalIsOpen] = useState(false);
  const { stockName } = useParams<{ stockName: string }>();

  const handleCloseTradingModal = () => setTradingModalIsOpen(false);

  const handleGetStartDate = (): Date => {
    const date = new Date();

    switch (activeYear) {
      case 'one_day':
        return new Date(date.getTime() - 24 * 60 * 60 * 1000);

      case 'one_month':
        return new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());

      case 'six_months':
        return new Date(date.getFullYear(), date.getMonth() - 6, date.getDate());

      case 'one_year':
        return new Date(date.getFullYear() - 1, date.getMonth(), date.getDate());

      case 'five_years':
        return new Date(date.getFullYear() - 5, date.getMonth(), date.getDate());

      default:
        return new Date();
    }
  };

  const { data: chartData } = useQuery({
    queryKey: ['quotationChart', activeYear],
    queryFn: () =>
      StocksService.quotationChart({
        ticker: stockName,
        start: formatDateToYYYYMMDD(handleGetStartDate()),
        end: formatDateToYYYYMMDD(new Date()),
      }),
  });

  console.log(chartData);

  return (
    <ContentWrapper className='py-6 px-4'>
      <div className='flex justify-between flex-col sm:flex-row sm:items-center gap-2 px-6'>
        <div className='flex items-center gap-x-3'>
          <Filter
            className='!p-0 uppercase'
            options={viewTypes}
            active={viewType}
            onChange={setViewType}
          />
          <button
            className='text-grayLight hover:text-white'
            onClick={() => setTradingModalIsOpen(true)}
          >
            <QuestionIcon width={16} height={16} />
          </button>
        </div>
        <Filter className='!p-0' options={years} active={activeYear} onChange={setActiveYear} />
      </div>

      <YearDiagram
        id='etf-diagram'
        data={mockDiagramData}
        className='min-h-[350px] px-6'
        strokeColor='#A06AFF'
        colors={['#A06AFF52', '#181A2000']}
        yAxisDx={0}
        yAxisDy={0}
        margin={{
          top: 20,
          right: -20,
          bottom: 20,
          left: 0,
        }}
      />
      <ModalV2
        isOpen={tradingModalIsOpen}
        onClose={handleCloseTradingModal}
        contentClassName='border-[1px] border-regaliaPurple px-4 py-6 w-full max-w-[1080px] max-h-[900px] overflow-y-auto'
      >
        <div className='flex flex-col gap-y-6'>
          <TradingModalSingleChart />
          <TradingModalMultipleChart />
        </div>
      </ModalV2>
    </ContentWrapper>
  );
};
