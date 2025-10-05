import type { FC } from 'react';

import Paper from '@/components/UI/Paper';
import DividedRow from '@/components/UI/DividedRow';
import TagLabel from '@/components/UI/TagLabel';

import LikeIcon from '@/assets/icons/icon-like.svg';
import ShareIcon from '@/assets/icons/icon-share.svg';
import ClockIcon from '@/assets/icons/icon-clock.svg';
import PocketIcon from '@/assets/icons/icon-pocket.svg';
import MoneyIcon from '@/assets/icons/icon-money.svg';

type AnalystInfo = {
  followers: number;
  tradingDays: number;
  stabilityIndex: number;
  weekViews: number;
  aum: number;
  totalAssets: number;
  profitSharing: number;
  tags: string[];
};

interface IAnalystCardInfoProps {
  analystInfo: AnalystInfo;
}

export const AnalystCardInfo: FC<IAnalystCardInfoProps> = ({ analystInfo }) => {
  const {
    followers,
    tradingDays,
    stabilityIndex,
    weekViews,
    aum,
    totalAssets,
    profitSharing,
    tags,
  } = analystInfo;

  const analystTopList = [
    { value: followers, label: 'Followers' },
    { value: tradingDays, label: 'Trading days' },
    { value: `${stabilityIndex.toFixed(1)}/5.0`, label: 'Stability Index' },
    { value: weekViews, label: 'Views (7D)' },
  ];

  const analystBotList = [
    { Icon: MoneyIcon, label: 'AUM', value: `${aum.toFixed(2)} USDT` },
    { Icon: PocketIcon, label: 'Total Assets', value: `${totalAssets.toFixed(2)} USDT` },
    { Icon: ClockIcon, label: 'Profit Sharing', value: `${profitSharing}%` },
  ];

  return (
    <Paper className='p-4'>
      <div className='flex gap-x-4 justify-between'>
        <DividedRow gap={4}>
          {analystTopList.map(({ value, label }) => (
            <div key={label} className='flex flex-col gap-y-1 font-bold'>
              <span className='uppercase text-lighterAluminum text-[12px]'>{label}</span>
              <span>{value}</span>
            </div>
          ))}
        </DividedRow>
        <div className='flex items-center gap-x-1 text-[12px] font-bold self-start'>
          <button className='flex items-center gap-x-1 hover:underline focus:underline'>
            <ShareIcon />
            Share
          </button>
          <span className='inline-block w-[1px] bg-lighterAluminum self-stretch' />
          <button className='flex items-center gap-x-1 hover:underline focus:underline'>
            <LikeIcon />
            Subscribe
          </button>
        </div>
      </div>
      <DividedRow gap={1} className='mt-6'>
        {analystBotList.map(({ Icon, label, value }) => (
          <div className='flex items-center gap-x-1 text-[12px] font-bold'>
            <Icon />
            <span>
              {label}: {value}
            </span>
          </div>
        ))}
      </DividedRow>
      <ul className='flex items-center gap-x-2 flex-wrap mt-4'>
        {tags.map((tag, i) => (
          <li key={tag}>
            <TagLabel value={tag} category={i === 0 ? 'good' : 'midle'} />
          </li>
        ))}
      </ul>
    </Paper>
  );
};
