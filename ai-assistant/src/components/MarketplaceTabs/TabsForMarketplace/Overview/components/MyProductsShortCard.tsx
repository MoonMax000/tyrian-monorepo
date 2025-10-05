import React from 'react';
import { IndicatorTag } from '@/components/ui/IndicatorTag/IndicatorTag';
import DownloadIcon from '@/assets/icons/icon-download.svg';
import SettingsIcon from '@/assets/icons/icon-settings.svg';
import MockChart from '@/assets/mock-chart-xs.svg';

const columnsNames = ['Product', 'Sales', 'Status'];

const rows = [
  {
    product: {
      icon: <MockChart />,
      name: 'Crypto Trading Signals',
      comment: 'Analysis Tools',
    },
    sales: '15',
    status: 'Active',
  },
  {
    product: {
      icon: <MockChart />,
      name: 'Intro to Python for Finance',
      comment: 'Online Courses',
    },
    sales: '0',
    status: 'Draft',
  },
  {
    product: {
      icon: <MockChart />,
      name: 'Automated Swing Trading Bot',
      comment: 'Bots & Scripts',
    },
    sales: '22',
    status: 'Active',
  },
];

export function MyProductsShortCard() {
  return (
    <div className='container-card flex flex-col p-4 rounded-[24px] gap-6 max-w-[100%]'>
      <div className='text-white font-bold text-[24px] flex items-center justify-between '>
        <span>My Products</span>
        <span className='text-[15px] font-bold text-lightPurple cursor-pointer'>
          View all
        </span>
      </div>
      <div className='grid grid-cols-[65%_10%_10%_auto] gap-y-4 text-[15px] font-[700]'>
        {columnsNames.map((name) => (
          <span
            key={name}
            className='uppercase text-lighterAluminum text-[12px] font-[700]'
          >
            {name}
          </span>
        ))}
        <span className='text-center uppercase text-lighterAluminum text-[12px] font-[700]'>
          Actions
        </span>

        {rows.map((row, i) => (
          <React.Fragment key={i}>
            <div className='flex items-center gap-2'>
              {row.product.icon}
              <div className='flex flex-col gap-1'>
                <span>{row.product.name}</span>
                <span className='text-lighterAluminum text-[12px] font-[700]'>
                  {row.product.comment}
                </span>
              </div>
            </div>
            <span className='flex items-center'>{row.sales}</span>
            <div className='flex items-center'>
              <IndicatorTag
                className='w-fit flex h-fit items-center text-[12px]'
                type={row.status === 'Active' ? 'darckGreen' : 'orange'}
              >
                {row.status}
              </IndicatorTag>
            </div>
            <div className='flex items-center justify-center gap-2'>
              <DownloadIcon />
              <SettingsIcon />
            </div>

            {i !== rows.length - 1 && (
              <div className='col-span-4 border-t border-b border-[#181B22]' />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
