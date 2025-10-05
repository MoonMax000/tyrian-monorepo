import React from 'react';
import { IndicatorTag } from '@/components/ui/IndicatorTag/IndicatorTag';

const columnsNames = ['Order #', 'Product', 'Buyer', 'Price', 'Status'];

const rows = [
  {
    orderNumber: 'ord-001',
    product: 'Crypto Trading Signals',
    buyer: 'Jane Doe',
    price: '$49.00',
    status: 'Completed',
  },
  {
    orderNumber: 'ord-002',
    product: 'Intro to Python for Finance',
    buyer: 'John Doe',
    price: '$199.00',
    status: 'Completed',
  },
  {
    orderNumber: 'ord-003',
    product: 'Crypto Trading Signals',
    buyer: 'John Smith',
    price: '$49.00',
    status: 'Pending',
  },
];

export function RecentSalesCard() {
  return (
    <div className='container-card flex flex-col p-4 rounded-[24px] gap-6 max-w-[100%]'>
      <div className='text-white font-bold text-[24px] flex items-center justify-between '>
        <span>Recent Sales</span>
        <span className='text-[15px] font-bold text-lightPurple cursor-pointer'>
          View all
        </span>
      </div>
      <div className='grid grid-cols-[15%_40%_15%_15%_auto] gap-y-4 text-[15px] font-[700]'>
        {columnsNames.map((name) => (
          <span
            key={name}
            className='uppercase text-lighterAluminum text-[12px] font-[700]'
          >
            {name}
          </span>
        ))}

        {rows.map((row, i) => (
          <React.Fragment key={i}>
            <div className='flex items-center gap-2'>
              <span>{row.orderNumber}</span>
            </div>
            <span className='flex items-center text-lighterAluminum'>
              {row.product}
            </span>
            <span className='flex items-center text-lighterAluminum'>
              {row.buyer}
            </span>
            <span className='flex items-center'>{row.price}</span>
            <div className='flex items-center'>
              <IndicatorTag
                className='w-fit flex h-fit items-center text-[12px]'
                type={row.status === 'Completed' ? 'darckGreen' : 'orange'}
              >
                {row.status}
              </IndicatorTag>
            </div>

            {i !== rows.length - 1 && (
              <div className='col-span-5 border-t border-b border-[#181B22]' />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
