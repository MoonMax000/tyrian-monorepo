'use client';

import Paper from '@/components/Paper';
import { formatCurrency } from '@/helpers/formatCurrency';
import { Tooltip } from 'react-tooltip';
import { mockFundamentalAnalysis } from './constants';
import IconInfoCirle from '@/assets/icons/info-circle.svg';

const BasicsAnalysis = () => {
  return (
    <Paper className='!px-0 pt-6 pb-4'>
      <h3 className='text-h4 ml-6'>Fundamental Analysis</h3>

      <div className='grid items-center gap-2 justify-between grid-cols-[50%,auto,auto] mx-6 mb-2 mt-6'>
        <p className='opacity-40 text-body-12 font-bold uppercase'>Indicator</p>
        <p className='opacity-40 text-body-12 font-bold uppercase'>Company</p>
        <p className='opacity-40 text-body-12 font-bold uppercase'>Industry</p>
      </div>

      <ul>
        {mockFundamentalAnalysis.map((item) => (
          <li
            key={item.indicator}
            className='grid items-center gap-2 justify-between grid-cols-[50%,auto,auto] odd:bg-[#272A32] py-[9px] px-6'
          >
            <div className='flex items-center gap-[6px]'>
              <p className='text-body-15'>{item.indicator}</p>
              <IconInfoCirle
                className='size-4'
                data-tooltip-id={item.indicator}
                data-tooltip-content={item.tooltip}
              />
              <Tooltip id={item.indicator} />
            </div>

            <p className='text-body-15'>{item.company}</p>
            <p className='text-body-15'>{item.branch}</p>
          </li>
        ))}
      </ul>

      <div className='mx-6 mt-6'>
        <h5 className='text-h4'>Изменение цены за год</h5>
        <div className='flex items-center justify-between relative mt-3'>
          <p className='text-body-12 font-bold'>
            {formatCurrency(168.3, {
              minimumFractionDigits: 2,
            })}
          </p>
          <p className='text-body-12 font-bold'>
            {formatCurrency(676.3, {
              minimumFractionDigits: 2,
            })}
          </p>

          <p className='absolute left-[30%] -top-1 font-bold text-body-15'>
            {formatCurrency(199.8, {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className='relative rounded-[4px] bg-[linear-gradient(90deg,rgba(96,64,153,0)_0%,#A06AFF_100%)] h-6 mt-2 mb-[2px]'>
          <span className='absolute top-0 left-[30%] size-6 min-w-6 min-h-6 rounded-[50%] bg-purple border-[5px] border-blackedGray' />
        </div>
        <div className='flex items-center justify-between'>
          <p className='text-body-12 font-bold opacity-[48%]'>МИН</p>
          <p className='text-body-12 font-bold opacity-[48%]'>МАКС</p>
        </div>
      </div>
    </Paper>
  );
};

export default BasicsAnalysis;
