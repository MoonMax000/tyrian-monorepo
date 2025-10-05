import { useState, type FC } from 'react';
import clsx from 'clsx';
import ContentWrapper from '@/components/UI/ContentWrapper';
import SwitchButtons from '@/components/UI/SwitchButtons';
import QuestionIcon from '@/assets/icons/question.svg';
import DiagramNotificationEl from '@/components/Diagrams/DiagramNotificationEl/DiagramNotificationEl';
import ComparisonBarChart from '@/components/Diagrams/ComprisonDiagram';
import { profitGrowtHistoryMock } from '../constants';

const viewTypes = [
  { label: 'last year', profitability: 2.02, value: 'last year' },
  { label: '3-years', profitability: 4.1, value: '3years' },
  { label: '5-years', profitability: 8.9, value: '5years' },
];

export const ProfitGrowtHistory: FC = () => {
  const [viewType, setViewType] = useState(viewTypes[0].value);

  return (
    <ContentWrapper className='py-6 px-4'>
      <div className='flex gap-x-[6px] items-center'>
        <h2 className='text-[24px] text-white font-bold'>Profit Growt History</h2>
        <button className='text-grayLight hover:text-white'>
          <QuestionIcon width={20} height={20} />
        </button>
      </div>
      <SwitchButtons
        items={viewTypes}
        currentValue={viewType}
        onChange={setViewType}
        renderButton={({ label, profitability, value: value }, index) => (
          <div className='flex items-center gap-x-2'>
            <span className='uppercase text-[12px] font-bold'>{label}</span>
            <span
              className={clsx('text-[12px] font-extrabold', {
                'text-green': profitability >= 0 && value !== viewType,
                'text-red': profitability < 0 && value !== viewType,
              })}
            >
              {profitability > 0 && '+'}
              {index === 0 ? `${profitability.toFixed(2)}%` : `${profitability.toFixed(2)}%/year`}
            </span>
          </div>
        )}
        className='mt-6'
      />
      <ComparisonBarChart data={profitGrowtHistoryMock} className='mt-6' />
      <div className='flex items-center justify-center gap-x-12 gap-y-6 mt-4 px-4'>
        <div className='flex items-center gap-2'>
          <div className='size-3 rounded-full bg-purple' />
          <div className='flex flex-col gap-y-1'>
            <span className='text-[12px] font-bold uppercase text-grayLight leading-[100%]'>
              Company
            </span>
            <span className='text-[15px] font-bold uppercase text-white'>
              {profitGrowtHistoryMock.company.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <div className='size-3 rounded-full bg-[#5D7FFF]' />
          <div className='flex flex-col gap-y-1'>
            <span className='text-[12px] font-bold uppercase text-grayLight leading-[100%]'>
              Industry
            </span>
            <span className='text-[15px] font-bold uppercase text-white'>
              {profitGrowtHistoryMock.industry.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <div className='size-3 rounded-full bg-yellow' />
          <div className='flex flex-col gap-y-1'>
            <span className='text-[12px] font-bold uppercase text-grayLight leading-[100%]'>
              Market
            </span>
            <span className='text-[15px] font-bold uppercase text-white'>
              {profitGrowtHistoryMock.market.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
      <DiagramNotificationEl
        classname='mt-6'
        message='XXXX has become more efficient at generating Return on Captal (N%) compared to three years ago (N%)'
        label='Growing ratio'
        signal='good'
      />
    </ContentWrapper>
  );
};
