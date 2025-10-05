'use client';

import React from 'react';
import Button from '@/components/ui/Button/Button';
import AcceptIcon from '@/assets/icons/accept.svg';
import { Select } from '@/components/ui/Select';
import { PayoutsRow } from './components/PayoutsRow';

const rows = [
  {
    date: '12.09.25',
    amount: '$89.99',
    status: 'Pending',
  },
  {
    date: '12.08.25',
    amount: '$19.99',
    status: 'Completed',
  },
];

function PayoutsTab() {
  return (
    <div className='flex flex-col gap-[24px]'>
      <div className='text-white font-bold text-[24px]'>Payouts</div>
      <div className='flex w-full gap-6 items-center'>
        <div className='container-card p-4 flex w-full flex-col gap-4 min-w-[788px]'>
          <span className='text-white font-bold text-[24px]'>
            Payout Overview
          </span>
          <div className='flex w-full items-center gap-2'>
            <div className='container-card p-4 flex w-full flex-col gap-3'>
              <span className='text-lighterAluminum text-[12px] font-[700] uppercase'>
                Balance
              </span>
              <span className='font-bold text-[19px]'>$1,540.50</span>
            </div>
            <div className='container-card p-4 flex w-full flex-col gap-3'>
              <span className='text-lighterAluminum text-[12px] font-[700] uppercase'>
                Pending
              </span>
              <span className='font-bold text-[19px]'>$2,450.75</span>
            </div>
            <div className='container-card p-4 flex w-full flex-col gap-3'>
              <span className='text-lighterAluminum text-[12px] font-[700] uppercase'>
                Next payout
              </span>
              <div className='flex items-center justify-between'>
                <span className='text-white font-bold text-[15px]'>
                  20.06.2025
                </span>
                <span className='text-white font-bold text-[19px]'>
                  $500.00
                </span>
              </div>
            </div>
          </div>
          <Button className='w-fit rounded-[32px] px-4' variant='primary'>
            Request Payout
          </Button>
        </div>
        <div className='container-card p-4 flex w-full flex-col gap-4 min-w-[481px]'>
          <span className='text-white font-bold text-[24px]'>
            Connect Stripe
          </span>
          <div className='flex w-full p-4 rounded-[16px] gap-4 bg-gradient-to-l from-[#8E61F6] to-[#0F0A1B] border-darkPurple'>
            <AcceptIcon />
            <div className='flex flex-col gap-4'>
              <span className='font-bold text-[15px]'>Stripe connected</span>
              <span className='font-medium text-[15px]'>
                You can request payouts to your account.
              </span>
            </div>
          </div>
          <Button
            className='rounded-[32px] px-4 border-[#181B22] text-[#B0B0B0]'
            variant='secondary'
          >
            Connect Stripe
          </Button>
        </div>
      </div>
      <div className='flex w-full justify-between items-center'>
        <div className='text-white font-bold text-[24px]'>Payout History</div>
        <div className='flex items-end gap-3'>
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
          <div className='flex-1 flex flex-col gap-1'>
            <div className='text-lighterAluminum text-[12px] font-[700] '>
              Amount Range
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
        </div>
      </div>
      <div className='container-card p-4 grid grid-cols-[33%_33%_31%] gap-y-4 text-[15px] font-[700]'>
        <span className='uppercase text-lighterAluminum text-[12px] font-[700] '>
          Date
        </span>
        <span className='uppercase text-lighterAluminum text-center text-[12px] font-[700] '>
          Amount
        </span>
        <span className='uppercase text-lighterAluminum text-right text-[12px] font-[700] '>
          Status
        </span>
        {rows.map((row, i) => (
          <React.Fragment key={i}>
            <PayoutsRow key={i} {...row} />
            {i !== rows.length - 1 && (
              <div className='col-span-3 border-t border-b border-[#181B22]'></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default PayoutsTab;
