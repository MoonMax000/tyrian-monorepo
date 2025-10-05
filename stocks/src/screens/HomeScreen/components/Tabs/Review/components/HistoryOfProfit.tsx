import { useState, useMemo, type FC } from 'react';
import ContentWrapper from '@/components/UI/ContentWrapper';
import Filter from '@/components/UI/Filter';
import { IFinanceIndicatorEl } from '@/components/Diagrams/constants';
import HistoryofProfitDiagram from '@/components/Diagrams/HistoryJfProfitDiagram';
import DiagramNotificationEl from '@/components/Diagrams/DiagramNotificationEl/DiagramNotificationEl';
import QuestionIcon from '@/assets/icons/question.svg';
import { formatNumberWithSymbols } from '@/helpers/formatNumberWithSymbols';
import { formatMoney } from '@/helpers/formatMoney';

const HISTORY_FINANCE_MOCK: IFinanceIndicatorEl[] = [
  {
    date: '2019',
    operating_profit: 2010,
    revenue: 2000,
    left_indicator: 2400,
    right_indicator: 2300,
  },
  {
    date: '2020',
    operating_profit: 4000,
    revenue: 3000,
    left_indicator: 1398,
    right_indicator: 1500,
  },
  {
    date: '2021',
    operating_profit: 5000,
    revenue: 2000,
    left_indicator: 9800,
    right_indicator: 9700,
  },
  {
    date: '2022',
    operating_profit: 6000,
    revenue: 2780,
    left_indicator: 3908,
    right_indicator: 3700,
  },
  {
    date: '2023',
    operating_profit: 3000,
    revenue: 1890,
    left_indicator: 4800,
    right_indicator: 3400,
  },
];

const viewTypes = [
  { key: 'y', name: 'Y' },
  { key: 'q', name: 'Q' },
];

export const HistoryOfProfit: FC = () => {
  const [viewType, setViewType] = useState(viewTypes[0].key);

  const transformedData = useMemo(
    () =>
      HISTORY_FINANCE_MOCK.map(({ revenue, operating_profit, date }) => ({
        date,
        revenue,
        operating_profit,
        profitability: (revenue / operating_profit) * 100,
      })),
    [],
  );

  return (
    <ContentWrapper className='px-4 py-6'>
      <div className='flex items-center justify-between gap-4 flex-wrap'>
        <div className='flex items-center gap-x-[6px]'>
          <h2 className='text-white text-[24px] font-bold'>Profit History</h2>
          <button className='text-grayLight hover:text-white'>
            <QuestionIcon />
          </button>
        </div>
        <Filter options={viewTypes} active={viewType} onChange={setViewType} />
      </div>
      <HistoryofProfitDiagram height={220} width='100%' className='mt-6' data={transformedData} />
      <div className='flex items-center justify-center gap-x-12 gap-y-6 mt-4 px-4'>
        <div className='flex items-center gap-2'>
          <div className='size-3 rounded-full bg-purple' />
          <div className='flex flex-col gap-y-1'>
            <span className='text-[12px] font-bold uppercase text-grayLight leading-[100%]'>
              Revenue
            </span>
            <span className='text-[12px] font-bold uppercase text-white'>
              {formatMoney(Math.max(...transformedData.map(({ revenue }) => revenue)), '', 2)}
            </span>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <div className='size-3 rounded-full bg-[#5D7FFF]' />
          <div className='flex flex-col gap-y-1'>
            <span className='text-[12px] font-bold uppercase text-grayLight leading-[100%]'>
              Profit
            </span>
            <span className='text-[12px] font-bold uppercase text-white'>
              {formatMoney(
                Math.max(...transformedData.map(({ operating_profit }) => operating_profit)),
                '',
                0,
              )}
            </span>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <div className='size-3 rounded-full bg-yellow' />
          <div className='flex flex-col gap-y-1'>
            <span className='text-[12px] font-bold uppercase text-grayLight leading-[100%]'>
              Profitability
            </span>
            <span className='text-[12px] font-bold uppercase text-white'>
              {formatNumberWithSymbols({
                num: Math.max(...transformedData.map(({ profitability }) => profitability)),
                symbolAfter: '%',
              })}
            </span>
          </div>
        </div>
      </div>
      <DiagramNotificationEl
        classname='mt-6'
        message='XXXX has demostrated stable long-term profit growth over the past 10 years (N%).'
        label='Growing ratio'
        signal='good'
      />
    </ContentWrapper>
  );
};
