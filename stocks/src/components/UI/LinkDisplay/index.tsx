import Link from 'next/link';
import clsx from 'clsx';
import Paper from '@/components/Paper';
import { formatCurrency } from '@/helpers/formatCurrency';
import { FC } from 'react';
import Image from 'next/image';

type LinkDisplayProps = {
  linkItem: {
    icon: string;
    shortName: string;
    price: number;
    profitability: number;
    href: string;
  };
  width?: number | string;
};

const LinkDisplay: FC<LinkDisplayProps> = ({ linkItem, width = 243 }) => {
  return (
    <Link href={linkItem.href} className='h-full inline-block' style={{ width }}>
      <Paper className='!px-4 gap-4 !py-3 !p-0 !flex flex-col cursor-pointer justify-between border-[2px] border-onyxGrey h-full transition-all hover:shadow-[0px_4px_17px_-6px_#0000007A] hover:bg-moonlessNight hover:border-transparent'>
        <div className='flex items-center gap-[10px]'>
          <Image
            src={linkItem.icon}
            alt='flag'
            width={20}
            height={20}
            className='object-contain rounded-full'
          />
          <p className='text-body-12 uppercase opacity-50'>{linkItem.shortName}</p>
        </div>

        <div className='flex items-center gap-2'>
          <p className='text-body-15'>{formatCurrency(linkItem.price)}</p>
          <div
            className={clsx('w-max py-[2px] px-1 rounded text-body-12 line-clamp-1', {
              'bg-darkGreen text-green': linkItem.profitability > 0,
              'bg-darkRed text-red': linkItem.profitability < 0,
              'bg-[#aaa8a829]': linkItem.profitability === 0,
            })}
          >
            {linkItem.profitability > 0 && '+'}
            {linkItem.profitability.toFixed(2)}%
          </div>
        </div>
      </Paper>
    </Link>
  );
};

export default LinkDisplay;
