import Paper from '@/components/Paper';
import Link from 'next/link';
import Image from 'next/image';
import { FC } from 'react';
import clsx from 'clsx';
import { formatCurrency } from '@/helpers/formatCurrency';
import { IMarketLeadersEl } from '@/services/MainPageService';
import DefaultIcon from '@/assets/defaultIcon.png';
import { getImageLink } from '@/helpers/getImageLink';

interface StockLeadersProps {
  title: string;
  link?: string;
  stocks: IMarketLeadersEl[];
}

const StockLeaders: FC<StockLeadersProps> = ({ link, stocks, title }) => {
  return (
    <Paper className='!p-0 overflow-hidden'>
      <div className='flex items-center justify-between p-6 pb-4 border-b-[2px] border-moonlessNight'>
        <h4 className='text-h4'>{title}</h4>
        {!!link && (
          <Link href={link} className='text-body-15 text-purple flex items-center gap-[10px]'>
            {'View All'}
            <Image src='/arrow-circuled.svg' alt='arrow' width={5.52} height={7.06} />
          </Link>
        )}
      </div>

      <ul>
        {stocks.map((item, index) => {
          const imageSrc =
            item.icon && item.icon.trim() !== '' && item.icon.includes('company_icons')
              ? getImageLink(item.icon)
              : DefaultIcon.src;

          return (
            <li
              key={`${item.name}` + `${index}`}
              className='p-6 grid grid-cols-[60%,35%] items-center justify-between gap-5 even:bg-moonlessNight'
            >
              <Link href={`/stock/${item.symbol}`}>
                <div className='grid grid-cols-[74px,calc(100%-100px)] items-center gap-5'>
                  <div className='flex items-center gap-2'>
                    <div className='size-6 min-w-6 min-h-6 rounded-[50%] overflow-hidden'>
                      <Image
                        src={imageSrc}
                        alt={item.name}
                        width={24}
                        height={24}
                        className='object-cover'
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

              <div className='flex items-center justify-between gap-8'>
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
    </Paper>
  );
};

export default StockLeaders;
