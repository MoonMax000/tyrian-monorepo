'use client';

import React from 'react';
import MockChart from '@/assets/mock-chart-xs.svg';
import { Select } from '@/components/ui/Select';
import Paper from '@/components/ui/Paper/Paper';
import Button from '@/components/ui/Button/Button';
import { cn } from '@/utilts/cn';
import { MyProductsRow } from './MyProductsRow';
import PlusIcon from '@/assets/plus.svg';

const rows = [
  {
    product: {
      icon: <MockChart />,
      name: 'Market Analysis Tool',
    },
    seller: `Bots & Scripts`,
    price: '$89.99',
    status: 'Published',
    date: '12.05.2025',
    rating: 4,
    billing: 'Subscription',
    sales: '154',
  },
  {
    product: {
      icon: <MockChart />,
      name: 'Trading Journal Template',
    },
    seller: `Online Courses`,
    price: '$19.99',
    status: 'Published',
    date: '12.05.2025',
    rating: 4,
    billing: 'One-time',
    sales: '33',
  },
  {
    product: {
      icon: <MockChart />,
      name: 'Risk Management Handbook',
    },
    seller: `Online Courses`,
    price: '$29.99',
    status: 'Draft',
    date: '12.05.2025',
    rating: 4,
    billing: 'Subscription',
    sales: '223',
  },
  {
    product: {
      icon: <MockChart />,
      name: 'Stock Screening Tool',
    },
    seller: `Online Courses`,
    price: '$79.99',
    status: 'Inactive',
    date: '12.05.2025',
    rating: 4,
    billing: 'Subscription',
    sales: '294',
  },
  {
    product: {
      icon: <MockChart />,
      name: 'Options Trading Masterclass',
    },
    seller: `Online Courses`,
    price: '$149.99',
    status: 'Draft',
    date: '12.05.2025',
    rating: 4,
    billing: 'One-time',
    sales: '5',
  },
  {
    product: {
      icon: <MockChart />,
      name: 'Financial Freedom Blueprint',
    },
    seller: `Online Courses`,
    price: '$59.99',
    status: 'Draft',
    date: '12.05.2025',
    rating: 4,
    billing: 'One-time',
    sales: '0',
  },
];

const tableButtons = [
  {
    name: 'All',
    active: true,
  },
  {
    name: 'Active',
    active: false,
  },
  {
    name: 'Draft',
    active: false,
  },
  {
    name: 'Archived',
    active: false,
  },
];

const dropdownMenuItems = [
  {
    title: 'Status',
    content: 'All status',
  },
  {
    title: 'Type / Billing',
    content: 'All status',
  },
  {
    title: 'Category',
    content: 'All categories',
  },
  {
    title: 'Sales Volume',
    content: 'All volumes',
  },
  {
    title: 'Price Range',
    content: 'All prices',
  },
  {
    title: 'Rating',
    content: 'All ratings',
  },
  {
    title: 'Updated Date',
    content: 'All dates',
  },
  {
    title: 'Sort by',
    content: 'Newest',
  },
];

const columnsNames = [
  'Product',
  'Category',
  'Billing',
  'Sales',
  'Updated',
  'RATING',
  'Price',
  'Status',
];

export const MyProductsTab = () => {
  return (
    <div className='flex flex-col gap-[24px]'>
      <div className='flex justify-between items-center'>
        <div className='text-white font-bold text-[24px]'>My Products</div>
        <div className='flex items-end gap-3'>
          {dropdownMenuItems.map((item) => (
            <div key={item.title} className='flex-1 flex flex-col gap-1'>
              <div className='text-lighterAluminum text-[12px] font-[700] '>
                {item.title}
              </div>
              <Select
                options={[]}
                value={''}
                onChange={() => console.log('change')}
                placeholder={item.content}
                className='!py-[3px] !border-[#181B22] !rounded-[32px] !bg-[#0C1014]/50 !backdrop-blur-[100px]'
              />
            </div>
          ))}
        </div>
      </div>

      <Paper className='p-4 border border-[#181B22] flex flex-col gap-6'>
        <div className='flex w-full justify-between items-center'>
          <div className='flex gap-2 items-center'>
            {tableButtons.map((button) => (
              <Button
                key={button.name}
                ghost={button.active ? false : true}
                className={cn('h-[32px]', {
                  'rounded-[32px] px-4': true,
                  'border border-[#181B22] ': button.active ? false : true,
                  'text-lighterAluminum': button.active ? false : true,
                })}
              >
                <span>{button.name}</span>
              </Button>
            ))}
            <PlusIcon />
          </div>
          <Button className='p-2 h-[30px] w-[180px] flex gap-2 items-center text-[14px] !px-4 py-[10px]'>
            <PlusIcon /> Add product
          </Button>
        </div>

        <div className='grid grid-cols-[25%_10%_10%_5%_10%_10%_10%_10%_auto] gap-y-4 text-[15px] font-[700]'>
          {columnsNames.map((name) => (
            <span
              key={name}
              className='uppercase text-lighterAluminum text-[12px] font-[700] '
            >
              {name}
            </span>
          ))}
          <span className='text-center uppercase text-lighterAluminum text-[12px] font-[700] '>
            Actions
          </span>
          {rows.map((row, i) => (
            <React.Fragment key={i}>
              <MyProductsRow length={rows.length} index={i} key={i} {...row} />
              {i !== rows.length - 1 && (
                <div className='col-span-9 border-t border-b border-[#181B22]' />
              )}
            </React.Fragment>
          ))}
        </div>
      </Paper>
    </div>
  );
};
