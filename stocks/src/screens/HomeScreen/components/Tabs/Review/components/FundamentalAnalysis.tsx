import type { FC } from 'react';
import Table, { type IColumn } from '@/components/UI/Table';
import { formatNumberWithSymbols } from '@/helpers/formatNumberWithSymbols';
import QuestionIcon from '@/assets/icons/question.svg';
import { fundamentalAnalysisMockData } from '../constants';

const columns: IColumn<(typeof fundamentalAnalysisMockData)[number]>[] = [
  {
    key: 'indicator',
    label: 'Indicator',
    columnClassName: 'text-left',
    rowClassName: 'text-left',
    renderCell: ({ indicator }) => (
      <div className='flex items-center gap-x-1'>
        <span className='text-[15px] font-bold text-white'>{indicator}</span>
        <button className='text-grayLight hover:text-white'>
          <QuestionIcon />
        </button>
      </div>
    ),
  },
  {
    key: 'company',
    label: 'Company',
    renderCell: ({ company }) => company.toFixed(2),
  },
  {
    key: 'industry',
    label: 'Industry',
    renderCell: ({ industry }) => industry.toFixed(2),
  },
];

export const FundamentalAnalysis: FC = () => {
  const min = 168.3;
  const max = 676.3;
  const current = 360.6;
  const percentage = ((current - min) / (max - min)) * 100;

  return (
    <Table
      columns={columns}
      rows={fundamentalAnalysisMockData}
      rowKey='indicator'
      containerClassName='py-6 flex flex-col gap-y-4 bg-background'
      tableClassName='border-b-2 border-gunpowder'
      topContent={
        <div className='px-4'>
          <h2 className='text-white font-bold text-[24px]'>Fundamental Analysis</h2>
        </div>
      }
      bottomContent={
        <div className='pl-6 pr-4'>
          <h2 className='text-white font-bold text-[24px]'>1-year price change</h2>
          <div className='mt-[18px]'>
            <div className='flex items-center justify-between'>
              <span className='text-[12px] font-bold text-white'>
                {formatNumberWithSymbols({
                  num: min,
                  symbolBefore: '$',
                  toFixed: 2,
                })}
              </span>
              <span className='text-[12px] font-bold text-white'>
                {formatNumberWithSymbols({
                  num: max,
                  symbolBefore: '$',
                  toFixed: 2,
                })}
              </span>
            </div>
            <div className='relative w-full mt-[9px]'>
              <div
                className='absolute -top-7 text-[15px] text-white font-bold text-center pointer-events-none -translate-x-1/2'
                style={{ left: `${percentage}%` }}
              >
                {formatNumberWithSymbols({
                  num: current,
                  symbolBefore: '$',
                  toFixed: 2,
                })}
              </div>
              <input
                type='range'
                min={min}
                max={max}
                value={current}
                onChange={() => {}}
                className={`
              w-full h-6 appearance-none rounded-[4px] bg-transparent
              focus:outline-none
              bg-[linear-gradient(90deg,_#181A20_0%,_#A06AFF_100%)]

              [&::-webkit-slider-runnable-track]:h-3
              [&::-webkit-slider-runnable-track]:rounded-full
              [&::-webkit-slider-runnable-track]:bg-transparent
  
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:h-7
              [&::-webkit-slider-thumb]:w-7
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-regaliaPurple
              [&::-webkit-slider-thumb]:border-solid
              [&::-webkit-slider-thumb]:border-[6px]
              [&::-webkit-slider-thumb]:border-[#181A20]
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:translate-y-[-8px]
              [&::-webkit-slider-thumb]:relative
              [&::-webkit-slider-thumb]:z-[3]
  
              [&::-moz-range-track]:bg-transparent
              [&::-moz-range-thumb]:appearance-none
              [&::-moz-range-thumb]:h-7
              [&::-moz-range-thumb]:w-7
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-regaliaPurple
              [&::-moz-range-thumb]:border-solid
              [&::-moz-range-thumb]:border-4
              [&::-moz-range-thumb]:border-[#181A20]
              [&::-moz-range-thumb]:cursor-pointer
              [&::-moz-range-thumb]:translate-y-[-8px]
              [&::-moz-range-thumb]:relative
              [&::-moz-range-thumb]:z-[3]
            `}
              />
            </div>
            <div className='flex items-center justify-between'>
              {['min', 'max'].map((label) => (
                <span key={label} className='text-[12px] font-bold text-grayLight uppercase'>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      }
    />
  );
};
