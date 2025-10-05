import React from 'react';
import MockChart from '@/assets/mock-chart-xs.svg';

const columnsNames = ['Product', 'Price / Period', 'Next Payment'];

const rows = [
  {
    product: {
      icon: <MockChart />,
      name: 'Admin Panel v2.0',
    },
    sales: '$0.00 / monthly',
    date: '12.09.25',
  },
  {
    product: {
      icon: <MockChart />,
      name: 'Victor Illustrations Pack',
    },
    sales: '$10.00 / monthly',
    date: '12.09.25',
  },
  {
    product: {
      icon: <MockChart />,
      name: 'Victor Illustrations Pack',
    },
    sales: '$10.00 / monthly',
    date: '12.09.25',
  },
];

export function ActiveSubscribers() {
  return (
    <div className='container-card flex flex-col p-4 rounded-[24px] gap-6 max-w-[100%]'>
      <div className='text-white font-bold text-[24px] flex items-center justify-between '>
        <span>Active Subscribers</span>
        <span className='text-[15px] font-bold text-lightPurple cursor-pointer'>
          View all
        </span>
      </div>
      <div className='grid grid-cols-[60%_25%_15%] gap-y-4 text-[15px] font-[700]'>
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
              {row.product.icon}
              <span>{row.product.name}</span>
            </div>
            <span className='flex items-center'>{row.sales}</span>
            <div className='flex items-center'>
              <span>{row.date}</span>
            </div>

            {i !== rows.length - 1 && (
              <div className='col-span-3 border-t border-b border-[#181B22]' />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
