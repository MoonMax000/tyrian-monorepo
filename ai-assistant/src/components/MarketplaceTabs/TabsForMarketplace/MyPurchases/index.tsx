'use client';

import React, { useState } from 'react';
import SearchIconXs from '@/assets/search-xs.svg';
import MockChart from '@/assets/mock-chart-xs.svg';
import { Search } from '@/components/ui/Header/Search';
import { Select } from '@/components/ui/Select';
import Paper from '@/components/ui/Paper/Paper';
import { PurchaseRow } from './components/PurchaseRow';
import TabSwitchButton from '@/components/ui/TabSwitchButton';
import { Subscriptions } from './components/Subscriptions';

const headerPurchases = [
  'Product',
  'Seller',
  'Price',
  'Status',
  'DATE',
  'Actions',
];

const rowsPurchases = [
  {
    product: { icon: <MockChart />, name: 'Admin Panel v2.0' },
    seller: `LLC "Technodesign"`,
    price: '$149',
    status: 'Completed',
    date: '12.09.25',
  },
  {
    product: { icon: <MockChart />, name: 'Victor Illustrations Pack' },
    seller: `Studio "Artline"`,
    price: '$29',
    status: 'Completed',
    date: '12.09.25',
  },
];

const headerSubscriptions = [
  'Product',
  'Plan',
  'Seller',
  'Price / Period',
  'Start date',
  'Next Payment',
  'Status',
  'Actions',
];

const rowsSubscriptions = [
  {
    product: { icon: <MockChart />, name: 'Admin Panel v2.0' },
    plan: 'Free Trial',
    seller: `LLC "Technodesign"`,
    price: '$0.00',
    period: 'monthly',
    startDate: '12.08.25',
    nextPayment: '12.09.25',
    status: 'Completed',
  },
  {
    product: { icon: <MockChart />, name: 'Victor Illustrations Pack' },
    plan: 'Starter',
    seller: `Studio "Artline"`,
    price: '$10.00',
    period: 'monthly',
    startDate: '12.08.25',
    nextPayment: '12.09.25',
    status: 'Canceled',
  },
];

function MyPurchasesTab() {
  const [activeTab, setActiveTab] = useState<'purchases' | 'subscriptions'>(
    'purchases',
  );

  return (
    <div className='flex flex-col gap-[24px]'>
      <div className='flex justify-between items-center'>
        <div className='text-white font-bold text-[24px]'>My Purchases</div>
        <div className='flex items-end gap-3'>
          <Search
            wrapperClassName='!py-0 w-[288px]'
            inputWrapperClassName='!py-[3px] !border-[#181B22]'
            placeholder='Search'
            icon={<SearchIconXs />}
            iconPosition='left'
          />
          <div className='flex-1 flex flex-col gap-1'>
            <div className='text-lighterAluminum text-[12px] font-[700] '>
              Seller
            </div>
            <Select
              options={[]}
              value={''}
              onChange={() => console.log('change')}
              placeholder='All sellers'
              className='!py-[3px] !border-[#181B22] !rounded-[32px] !bg-[#0C1014]/50 !backdrop-blur-[100px]'
            />
          </div>
          <div className='flex-1 flex flex-col gap-1'>
            <div className='text-lighterAluminum text-[12px] font-[700] '>
              Price Range
            </div>
            <Select
              options={[]}
              value={''}
              onChange={() => console.log('change')}
              placeholder='All prices'
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
        </div>
      </div>

      <Paper className='p-4 border border-[#181B22] flex flex-col gap-6'>
        <div className='flex gap-2'>
          <TabSwitchButton
            active={activeTab === 'purchases'}
            onClick={() => setActiveTab('purchases')}
          >
            Purchases
          </TabSwitchButton>
          <TabSwitchButton
            active={activeTab === 'subscriptions'}
            onClick={() => setActiveTab('subscriptions')}
          >
            Subscriptions
          </TabSwitchButton>
        </div>

        {activeTab === 'purchases' && (
          <div className='grid grid-cols-[30%_25%_10%_10%_10%_auto] gap-y-4 text-[15px] font-[700]'>
            {headerPurchases.map((header, i) => (
              <span
                key={i}
                className={`uppercase text-lighterAluminum text-[12px] font-[700] ${
                  i === headerPurchases.length - 1 ? 'text-center' : ''
                }`}
              >
                {header}
              </span>
            ))}
            {rowsPurchases.map((row, i) => (
              <React.Fragment key={i}>
                <PurchaseRow {...row} />
                {i !== rowsPurchases.length - 1 && (
                  <div className='col-span-6 border-t border-b border-[#181B22]'></div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {activeTab === 'subscriptions' && (
          <div className='grid grid-cols-[20%_10%_15%_15%_10%_10%_10%_auto] gap-y-4 text-[15px] font-[700]'>
            {headerSubscriptions.map((header, i) => (
              <span
                key={i}
                className={`uppercase text-lighterAluminum text-[12px] font-[700] ${
                  i === headerSubscriptions.length - 1 ? 'text-center' : ''
                }`}
              >
                {header}
              </span>
            ))}
            {rowsSubscriptions.map((row, i) => (
              <React.Fragment key={i}>
                <Subscriptions {...row} />
                {i !== rowsSubscriptions.length - 1 && (
                  <div className='col-span-8 border-t border-b border-[#181B22]'></div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </Paper>
    </div>
  );
}

export default MyPurchasesTab;
