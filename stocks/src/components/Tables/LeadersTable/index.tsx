'use client';
import { getImageLink } from '@/helpers/getImageLink';
import DefaultIcon from '@/assets/defaultIcon.png';
import { formatCurrency } from '@/helpers/formatCurrency';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { IMarketLeadersEl } from '@/services/MainPageService';

const LeadersTable = ({ data }: { data: IMarketLeadersEl[] }) => {
  const leadersHeading = [
    { name: 'Ticker', key: 'ticker' },
    { name: 'Assets', key: 'stock' },
    { name: 'Price', key: 'coast' },
    { name: 'Changes', key: 'chsnge' },
  ];

  return (
    <>
      <ul className='bg-moonlessNight px-6 py-4 grid grid-cols-[11.5%,58.6%,22.5%,7.5%] rounded-t-xl'>
        {leadersHeading.map((heading, index) => (
          <li
            key={heading.key}
            className={clsx('text-body-12 font-semibold opacity-48 uppercase', {
              'text-right': index === 3,
              'ml-[56px]': index === 0,
              'text-left': index === 1,
            })}
          >
            {heading.name}
          </li>
        ))}
      </ul>

      <ul className='rounded-b-xl'>
        {data.map((item, index) => {
          const imageSrc =
            item.icon && item.icon.includes('company_icons')
              ? getImageLink(item.icon)
              : DefaultIcon.src;

          return (
            <li
              key={`${item.name}` + `${index}`}
              className='p-6 py-[14px] grid grid-cols-[60%,30%] items-center justify-between gap-5 bg-blackedGray last:rounded-b-xl even:bg-moonlessNight'
            >
              <Link href={`/stock/${item.symbol}`}>
                <div className='grid grid-cols-[100px,calc(100%-60px)] items-center gap-5'>
                  <div className='flex items-center gap-4'>
                    <div className='min-w-10 min-h-10 rounded-[50%] overflow-hidden'>
                      <Image
                        src={imageSrc}
                        alt={item.name}
                        width={40}
                        height={40}
                        className='w-10 h-10 object-cover'
                        loading='lazy'
                        unoptimized
                        onError={(e) => {
                          console.log('Изображение не найдено:', e.currentTarget.src);
                          e.currentTarget.src = DefaultIcon.src;
                        }}
                      />
                    </div>

                    <p className='text-body-15 line-clamp-1 opacity-[48%]'>{item.symbol}</p>
                  </div>

                  <p className='text-body-15 line-clamp-1'>{item.name}</p>
                </div>
              </Link>

              <div className='flex items-center justify-between gap-6'>
                <p className='text-body-15 line-clamp-1'>
                  {item.price ? formatCurrency(item.price) : '$0'}
                </p>

                <div
                  className={clsx('w-max min-w py-[2px] px-1 rounded text-body-12 line-clamp-1', {
                    'bg-darkGreen text-green':
                      item.changesPercentage > 0 || !item.changesPercentage,
                    'bg-darkRed text-red': item.changesPercentage < 0,
                  })}
                >
                  {item.changesPercentage > 0 && '+'}
                  {item.changesPercentage ? item.changesPercentage?.toFixed(2) : 0}%
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default LeadersTable;
