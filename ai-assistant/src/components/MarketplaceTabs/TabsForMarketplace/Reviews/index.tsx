'use client';

import React from 'react';
import SearchIconXs from '@/assets/search-xs.svg';
import { Search } from '@/components/ui/Header/Search';
import { Select } from '@/components/ui/Select';
import Paper from '@/components/ui/Paper/Paper';
import { ReviewRow } from './components/ReviewRow';

const rows = [
  {
    buyer: 'Jane Doe',
    product: 'Crypto Trading Signals',
    rating: 5,
    comment: 'Great signals, very profitable!',
    date: '12.08.25',
  },
  {
    buyer: 'Jane Doe',
    product: 'Intro to Python for Finance',
    rating: 4,
    comment: 'Good course, but could use more advanced examples.',
    date: '12.08.25',
  },
];

function ReviewsTab() {
  return (
    <div className='flex flex-col gap-[24px]'>
      <div className='flex justify-between items-center'>
        <div className='text-white font-bold text-[24px]'>Reviews</div>
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
              Rating
            </div>
            <Select
              options={[]}
              value={''}
              onChange={() => console.log('change')}
              placeholder='All ratings'
              className='!py-[3px] !border-[#181B22] !rounded-[32px] !bg-[#0C1014]/50 !backdrop-blur-[100px]'
            />
          </div>
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
        <div className='grid grid-cols-[10%_20%_10%_35%_10%_auto] gap-y-4 text-[15px] font-[700]'>
          <span className='uppercase text-lighterAluminum text-[12px] font-[700] '>
            Buyer
          </span>
          <span className='uppercase text-lighterAluminum text-[12px] font-[700] '>
            Product
          </span>
          <span className='uppercase text-lighterAluminum text-[12px] font-[700] '>
            Rating
          </span>
          <span className='uppercase text-lighterAluminum text-[12px] font-[700] '>
            Comment
          </span>
          <span className='uppercase text-lighterAluminum text-[12px] font-[700] '>
            DATE
          </span>
          <span className='text-center uppercase text-lighterAluminum text-[12px] font-[700] '>
            Actions
          </span>
          {rows.map((row, i) => (
            <React.Fragment key={i}>
              <ReviewRow key={i} {...row} />
              {i !== rows.length - 1 && (
                <div className='col-span-6 border-t border-b border-[#181B22]'></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </Paper>
    </div>
  );
}

export default ReviewsTab;
