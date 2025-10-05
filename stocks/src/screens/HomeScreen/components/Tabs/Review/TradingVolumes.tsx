'use client';

import Paper from '@/components/Paper';
import { Tooltip } from 'react-tooltip';
import { formatNumber } from '@/helpers/formatNumber';

export const mockTradingVolumes = [
  { indicator: 'Main market', count: 1984, company: 39.34, branch: 21.17 },
  { indicator: 'Negotiated Trades', count: 1, company: 5.15, branch: 2.22 },
  { indicator: 'REPO Market', count: 1, company: 39.34, branch: 21.17 },
  { indicator: 'Total (Excl. REPO)', count: 1984, company: -0.06, branch: 21.17 },
  { indicator: 'Total', count: 1984, company: 39.34, branch: 21.17 },
];

const TradingVolumes = () => {
  return (
    <Paper className='!px-0 pt-6 pb-0'>
      <h3 className='text-h4 pl-6'>Trading Volumes</h3>

      <div className='grid items-center gap-2 justify-between grid-cols-[20%,,25%,25%,25%]  mt-4 bg-moonlessNight px-6 py-3'>
        <p className='opacity-40 text-body-12 font-bold uppercase'>Data</p>
        <p className='opacity-40 text-body-12 font-bold uppercase text-right'>Trades</p>
        <p className='opacity-40 text-body-12 font-bold uppercase text-right'>VolUme (Units)</p>
        <p className='opacity-40 text-body-12 font-bold uppercase text-right'>Volume</p>
      </div>

      <ul>
        {mockTradingVolumes.map((item) => (
          <li
            key={item.indicator}
            className='grid items-center gap-2 justify-between grid-cols-[20%,,25%,25%,25%] py-6 px-6 border-t border-moonlessNight last:border-b-0'
          >
            <div className='flex items-center gap-[6px]'>
              <p className='text-body-15'>{item.indicator}</p>

              <Tooltip id={item.indicator} />
            </div>
            <p className='text-body-15 text-right'>{formatNumber(item.count)}</p>
            <p className='text-body-15 text-right'>{item.company}</p>
            <p className='text-body-15 text-right'>{item.branch}</p>
          </li>
        ))}
      </ul>

      {/* <div className='mx-6 mt-6'>
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
      </div> */}
    </Paper>
  );
};

export default TradingVolumes;
