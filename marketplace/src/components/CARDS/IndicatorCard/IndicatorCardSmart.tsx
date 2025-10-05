import type { FC } from 'react';
import Image, { type StaticImageData } from 'next/image';

import Button from '@/components/UI/Button/Button';
import SubCount from '@/components/UI/SubCount';
import TagLabel from '@/components/UI/TagLabel';

import StarIcon from '@/assets/icons/icon-star.svg';
import CheckIcon from '@/assets/icons/icon-check.svg';
import ChatIcon from '@/assets/icons/icon-chat.svg';
import DemoIcon from '@/assets/icons/icon-demo.svg';

import MockChart from 'public/mockCharts/chart-1.png';

import BaseCard from '../BaseCard';

type IIndicator = {
  indicatorName: string;
  subscribes: number;
  risk: 'medium' | 'low' | 'high';
  companies: (string | StaticImageData)[];
  price: number;
  assets: string[];
  type: string;
  timeframes: string[];
  use: string;
  accuracy: number;
};

interface IIndicatorCardSmartProps {
  indicator: IIndicator;
}

const riskType = {
  low: 'good',
  medium: 'some',
  high: 'strange',
} as const;

const IndicatorCardSmart: FC<IIndicatorCardSmartProps> = ({ indicator }) => {
  const {
    indicatorName,
    subscribes,
    accuracy,
    companies,
    price,
    assets,
    type,
    timeframes,
    use,
    risk,
  } = indicator;

  const indicatorList = [
    {
      label: 'assets',
      content: (
        <div className='flex items-center gap-x-1'>
          {assets.map((asset, i) => (
            <TagLabel key={i} category='none' value={asset} />
          ))}
        </div>
      ),
    },
    {
      label: 'type',
      content: <TagLabel category='none' value={type} />,
    },
    {
      label: 'timeframe',
      content: (
        <div className='flex items-center gap-x-1'>
          {timeframes.map((timeframe, i) => (
            <TagLabel key={i} category='midle' value={timeframe} />
          ))}
        </div>
      ),
    },
    {
      label: 'use',
      content: <TagLabel category='none' value={use} />,
    },
    {
      label: 'Product accuracy',
      content: <span className='text-green text-[15px] font-bold'>{accuracy}%</span>,
    },
  ];

  return (
    <BaseCard withTitleImg>
      <div className='p-4'>
        <div className='flex justify-between gap-x-2 items-center pb-[15px] border-b-[1px] border-gunpowder'>
          <div className='flex flex-col gap-y-1'>
            <h4 className='text-[19px font-bold'>{indicatorName}</h4>
            <div className='flex gap-x-1 items-center'>
              <SubCount personse={subscribes} />
              <TagLabel category={riskType[risk]} value={`RISK:${risk}`} />
            </div>
          </div>
        </div>
        {companies.length > 0 && (
          <div className='flex items-center gap-x-2 mt-4'>
            {companies.map((companyImg, i) => (
              <Image
                src={companyImg}
                key={i}
                alt={`company of ${indicatorName} ${i}`}
                width={32}
                height={32}
                className='rounded-full'
                placeholder='blur'
              />
            ))}
          </div>
        )}
        <ul className='flex flex-col gap-y-2 mt-4'>
          {indicatorList.map(({ label, content }) => (
            <li key={label} className='flex items-center gap-x-1'>
              <span className='text-lighterAluminum text-[12px] uppercase'>{label}:</span>
              {content}
            </li>
          ))}
        </ul>
        <span className='inline-block text-[24px] font-bold mt-6'>{`$${price} / month`}</span>
        <div className='flex flex-col gap-y-4 mt-6'>
          <Button className='flex items-center gap-x-2 max-h-[26px]'>
            <CheckIcon width={16} height={16} />
            Subscribe
          </Button>
          <Button className='flex items-center gap-x-2 max-h-[26px]' ghost>
            <ChatIcon width={16} height={16} />
            Chat
          </Button>
          <Button className='flex items-center gap-x-2 max-h-[26px]' ghost>
            <DemoIcon width={16} height={16} />
            Demo
          </Button>
        </div>
      </div>
    </BaseCard>
  );
};

export default IndicatorCardSmart;
