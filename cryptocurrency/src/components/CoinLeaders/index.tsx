import Link from 'next/link';
import { FC } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import Paper from '../UI/Paper';
import { formatCurrency } from '@/utils/helpers/formatCurrency';
import { CryptoData } from '@/types';

interface CoinLeadersProps {
  title: string;
  link: string;
  stocks: CryptoData[];
}

const CoinLeaders: FC<CoinLeadersProps> = ({ stocks, title }) => {
  return (
    <Paper className='!p-0 overflow-hidden'>
      <div className='flex items-center justify-between p-6 pb-4 border-b-[2px] border-[#FFFFFF14]'>
        <h4 className='text-2xl font-bold'>{title}</h4>
        {/* <Link
          href={link || "#"}
          // onClick={(e) => e.preventDefault()}
          className='text-[15px] font-bold text-purple flex items-center'
        >
          {'View All'}
          <svg
            width='6'
            height='10'
            viewBox='0 0 6 10'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='ml-[10px]'
          >
            <path
              d='M1.73828 8.52997L5.25828 4.99997L1.73828 1.46997'
              stroke='#A06AFF'
              strokeWidth='1.5'
            />
          </svg>
        </Link> */}
      </div>

      <ul>
        {stocks.map((item) => (
          <li key={item.id} className='even:bg-[#272A32]'>
            <Link
              href={`/coins/${item.slug}?symbol=${item.symbol}`}
              key={item.id}
              className='p-6 grid grid-cols-[100px_2fr_2fr_1fr] items-center justify-between gap-5'
            >
              <div className='flex items-center gap-2'>
                <div className='size-6 min-w-6 min-h-6 rounded-[50%] overflow-hidden'>
                  <Image
                    src={item.logo}
                    alt={item.name}
                    width={24}
                    height={24}
                    className='object-cover'
                  />
                </div>
                <p className='text-basic line-clamp-1 opacity-[48%]'>{item.symbol}</p>
              </div>

              <p className='text-basic line-clamp-1'>{item.name}</p>

              <p className='text-basic line-clamp-1'>
                {formatCurrency(item.quote.USD.price, { maximumFractionDigits: 7 })}
              </p>

              <div
                className={clsx('py-[2px] px-1 w-fit rounded text-[13px] leading-4 line-clamp-1', {
                  'bg-[#2EBD8529] text-green': item.quote.USD.percent_change_24h > 0,
                  'bg-[#EF454A29] text-red': item.quote.USD.percent_change_24h < 0,
                  'bg-[#aaa8a829]': item.quote.USD.percent_change_24h === 0,
                })}
              >
                {item.quote.USD.percent_change_24h > 0 && '+'}
                {item.quote.USD.percent_change_24h.toFixed(2)}%
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Paper>
  );
};

export default CoinLeaders;
