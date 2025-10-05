import type { FC } from 'react';
import Image, { type StaticImageData } from 'next/image';

import Button from '@/components/UI/Button/Button';
import SubCount from '@/components/UI/SubCount';
import TagLabel from '@/components/UI/TagLabel';
import ProcentLabel from '@/components/UI/ProcentLabel';

import StarIcon from '@/assets/icons/icon-star.svg';
import CheckIcon from '@/assets/icons/icon-check.svg';
import ChatIcon from '@/assets/icons/icon-chat.svg';

import MockChart from 'public/mockCharts/chart-1.png';

import BaseCard from '../BaseCard';

type IRobot = {
  robotName: string;
  subscribes: number;
  accuracy: 'medium' | 'low' | 'high';
  profitSharing: number;
  companies: (string | StaticImageData)[];
  price: number;
  pair: string;
  maxDropdown: number;
  types: string[];
  strategy: string;
  settings: string;
};

interface IRobotCardSmartProps {
  robot: IRobot;
}

const RobotCardSmart: FC<IRobotCardSmartProps> = ({ robot }) => {
  const {
    robotName,
    subscribes,
    accuracy,
    profitSharing,
    companies,
    price,
    pair,
    maxDropdown,
    types,
    strategy,
    settings,
  } = robot;

  const robotList = [
    { label: 'pair', content: <TagLabel category='none' value={pair} /> },
    { label: 'max dropdown', content: <ProcentLabel value={maxDropdown} border /> },
    {
      label: 'type',
      content: (
        <div className='flex items-center gap-x-1'>
          {types.map((type, i) => (
            <TagLabel key={i} category='none' value={type} />
          ))}
        </div>
      ),
    },
    {
      label: 'strategy',
      content: <TagLabel category='none' value={strategy} />,
    },
    {
      label: 'settings',
      content: <TagLabel category='midle' value={settings} />,
    },
  ];

  return (
    <BaseCard withTitleImg>
      <div className='p-4'>
        <div className='pb-[15px] border-b-[1px] border-gunpowder'>
          <div className='flex flex-col gap-y-1'>
            <h4 className='text-[19px font-bold'>{robotName}</h4>
            <div className='flex gap-x-1 items-center'>
              <SubCount personse={subscribes} />
              <TagLabel category='some' value={`${accuracy} accuracy`.toUpperCase()} />
            </div>
            <TagLabel category='good' value={`${profitSharing}% profit sharing`.toUpperCase()} />
          </div>
        </div>
        {companies.length > 0 && (
          <div className='flex items-center gap-x-2 mt-4'>
            {companies.map((companyImg, i) => (
              <Image
                src={companyImg}
                key={i}
                alt={`company of ${robotName} ${i}`}
                width={32}
                height={32}
                className='rounded-full'
                placeholder='blur'
              />
            ))}
          </div>
        )}
        <ul className='flex flex-col gap-y-2 mt-4'>
          {robotList.map(({ label, content }) => (
            <li key={label} className='flex items-center gap-x-1'>
              <span className='text-lighterAluminum text-[12px] uppercase'>{label}:</span>
              {content}
            </li>
          ))}
        </ul>
        <span className='inline-block text-[24px] font-bold mt-6'>{`$${price} / month`}</span>
        <div className='grid grid-cols-2 gap-x-4 mt-6'>
          <Button className='flex items-center gap-x-2 max-h-[26px]'>
            <CheckIcon width={16} height={16} />
            Subscribe
          </Button>
          <Button className='flex items-center gap-x-2 max-h-[26px]' ghost>
            <ChatIcon width={16} height={16} />
            Chat
          </Button>
        </div>
      </div>
    </BaseCard>
  );
};

export default RobotCardSmart;
