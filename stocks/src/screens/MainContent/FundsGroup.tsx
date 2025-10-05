import ArrowRight from '@/assets/icons/mini-arrow-right.svg';
import SpdrIcon from '@/assets/icons/spdr.svg';
import { PercentCard } from '@/components/PercentCard/PercentCard';
import Link from 'next/link';
import { FC } from 'react';
import { StocksValues } from './mockData';
import PercentLabel from '@/components/UI/percentLabel';
import { CryptoTab } from './Crypto';

interface Props {
  tabs?: CryptoTab[];
  linkTitle?: string;
  link?: string;
  values?: StocksValues[];
  handleChangeTab?: (id: number) => void;
}

export const FundsGroup: FC<Props> = ({ tabs, linkTitle, link, values, handleChangeTab }) => {
  const mockTabs = [
    {
      id: 0,
      name: 'Top gainers',
      isActive: true,
    },
    {
      id: 1,
      name: 'Top Losers',
      isActive: false,
    },
    {
      id: 2,
      name: 'Top Performing',
      isActive: false,
    },
  ];

  return (
    <div className='flex flex-col justify-between w-[740px] h-[531px]'>
      <div className='flex justify-between'>
        <div className='flex gap-2 '>
          {(tabs ? tabs : mockTabs).map((item, index) => (
            <button
              key={item.id + index}
              onClick={() => handleChangeTab?.(item.id)}
              className='flex items-center justify-center w-fit h-[40px] rounded-lg gap-[10px] py-[10px] px-[8px] border border-regaliaPurple'
              style={{
                padding: '10px 8px',
                background: item.isActive
                  ? 'linear-gradient(270deg, #A06AFF 0%, #482090 100%)'
                  : '',
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
        <Link href={link ?? ''}>
          <div className='flex items-center underline text-purple text-[15px] font-bold'>
            {linkTitle ? linkTitle : 'See All Funds and ETFs'} <ArrowRight />
          </div>
        </Link>
      </div>
      <div className='flex flex-wrap gap-x-[6px] gap-y-3 r-ga mt-5'>
        {values?.map((item: StocksValues, index) => (
          <div
            key={item.title + index}
            className='flex flex-col w-[242.333px] h-[136px] rounded-[24px] border border-regaliaPurple p-4 gap-[10px] backdrop-blur-[100px]'
            style={{
              background: 'rgba(12, 16, 20, 0.5)',
            }}
          >
            <div className='flex flex-col h-full justify-between'>
              <div className='flex gap-2'>
                {item.logo ? (
                  <img className='w-[44px] h-[44px] rounded-full' src={item.logo} alt='logo'></img>
                ) : (
                  <SpdrIcon />
                )}
                <div className='flex flex-col'>
                  <span className='text-[15px] font-bold truncate w-[158px]'>{item.desc}</span>
                  <span className='text-[15px] font-bold'>{item.title}</span>
                </div>
              </div>
              <div className='flex justify-between'>
                <span className='text-[19px] font-bold'>{item.price}$</span>
                <span>
                  {item.percent ? (
                    <PercentLabel value={item.percent} symbolAfter='%' />
                  ) : (
                    <PercentCard
                      className='bg-darkRed'
                      children={item.percent}
                      classNameText='text-red'
                    />
                  )}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
