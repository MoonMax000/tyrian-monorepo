'use client';

import React from 'react';
import { Select } from '@/components/ui/Select';
import Paper from '@/components/ui/Paper/Paper';
import Button from '@/components/ui/Button/Button';
import { cn } from '@/utilts/cn';
import { SalesRow } from './components/PurchaseRow';

const rows = [
  {
    orderNumber: 'ord-001',
    buyer: 'John Johnson',
    product: 'UI Kit Pro',
    amount: '$99',
    status: 'Completed',
    date: '12.08.25',
  },
  {
    orderNumber: 'ord-002',
    buyer: 'Mary Peterson',
    product: 'SaaS Dashboard Components',
    amount: '$129',
    status: 'Completed',
    date: '12.08.25',
  },
  {
    orderNumber: 'ord-003',
    buyer: 'Alex Mercer',
    product: 'UI Kit Pro',
    amount: '$99',
    status: 'Pending',
    date: '12.08.25',
  },
  {
    orderNumber: 'ord-004',
    buyer: 'Daria Santiago',
    product: 'UI Kit Pro',
    amount: '$19',
    status: 'Completed',
    date: '12.08.25',
  },
];

function SalesTab() {
  return (
    <div className='flex flex-col gap-[24px]'>
      <div className='flex justify-between items-center'>
        <div className='text-white font-bold text-[24px]'>Sales</div>
        <div className='flex items-end gap-3'>
          <div className='flex-1 flex flex-col gap-1'>
            <div className='text-lighterAluminum text-[12px] font-[700] '>
              Buyer
            </div>
            <Select
              options={[]}
              value={''}
              onChange={() => console.log('change')}
              placeholder='All buyers'
              className='!py-[3px] !border-[#181B22] !rounded-[32px] !bg-[#0C1014]/50 !backdrop-blur-[100px]'
            />
          </div>
          <div className='flex-1 flex flex-col gap-1'>
            <div className='text-lighterAluminum text-[12px] font-[700] '>
              Product
            </div>
            <Select
              options={[]}
              value={''}
              onChange={() => console.log('change')}
              placeholder='All products'
              className='!py-[3px] !border-[#181B22] !rounded-[32px] !bg-[#0C1014]/50 !backdrop-blur-[100px]'
            />
          </div>
          <div className='flex-1 flex flex-col gap-1'>
            <div className='text-lighterAluminum text-[12px] font-[700] '>
              Amount
            </div>
            <Select
              options={[]}
              value={''}
              onChange={() => console.log('change')}
              placeholder='All amounts'
              className='!py-[3px] !border-[#181B22] !rounded-[32px] !bg-[#0C1014]/50 !backdrop-blur-[100px]'
            />
          </div>
          <div className='flex-1 flex flex-col gap-1'>
            <div className='text-lighterAluminum text-[12px] font-[700] '>
              Status
            </div>
            <Select
              options={[]}
              value={''}
              onChange={() => console.log('change')}
              placeholder='All status'
              className='!py-[3px] !border-[#181B22] !rounded-[32px] !bg-[#0C1014]/50 !backdrop-blur-[100px]'
            />
          </div>
          <div className='flex-1 flex flex-col gap-1'>
            <div className='text-lighterAluminum text-[12px] font-[700] '>
              Date Range
            </div>
            <Select
              options={[]}
              value={''}
              onChange={() => console.log('change')}
              placeholder='All dates'
              className='!py-[3px] !border-[#181B22] !rounded-[32px] !bg-[#0C1014]/50 !backdrop-blur-[100px]'
            />
          </div>
          <div className='flex-1 flex flex-col gap-1'>
            <div className='text-lighterAluminum text-[12px] font-[700] '>
              Sort by
            </div>
            <Select
              options={[]}
              value={''}
              onChange={() => console.log('change')}
              placeholder='Newest'
              className='!py-[3px] !border-[#181B22] !rounded-[32px] !bg-[#0C1014]/50 !backdrop-blur-[100px]'
            />
          </div>
        </div>
      </div>

      <Paper className='p-4 border border-[#181B22] flex flex-col gap-6'>
        <div className='grid grid-cols-[10%_15%_35%_10%_10%_10%_auto] gap-y-4 text-[15px] font-[700]'>
          <span className='uppercase text-lighterAluminum text-[12px] font-[700] '>
            Order #
          </span>
          <span className='uppercase text-lighterAluminum text-[12px] font-[700] '>
            Buyer
          </span>
          <span className='uppercase text-lighterAluminum text-[12px] font-[700] '>
            Product
          </span>
          <span className='uppercase text-lighterAluminum text-[12px] font-[700] '>
            Amount
          </span>
          <span className='uppercase text-lighterAluminum text-[12px] font-[700] '>
            Status
          </span>
          <span className='uppercase text-lighterAluminum text-[12px] font-[700] '>
            DATE
          </span>
          <span className='text-center uppercase text-lighterAluminum text-[12px] font-[700] '>
            Actions
          </span>
          {rows.map((row, i) => (
            <React.Fragment key={i}>
              <SalesRow key={i} {...row} />
              {i !== rows.length - 1 && (
                <div className='col-span-7 border-t border-b border-[#181B22]'></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </Paper>
    </div>
  );
}

export default SalesTab;
