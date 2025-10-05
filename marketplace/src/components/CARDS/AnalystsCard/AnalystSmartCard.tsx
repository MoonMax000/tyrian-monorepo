import type { FC } from 'react';
import Image from 'next/image';

import Paper from '@/components/UI/Paper';
import ProcentLabel from '@/components/UI/ProcentLabel';
import TagLabel from '@/components/UI/TagLabel';
import SubCount from '@/components/UI/SubCount';
import NotesCount from '@/components/UI/NotesCount';
import Button from '@/components/UI/Button/Button';

import MockChart from '@/assets/bg-chart.svg';
import ChatIcon from '@/assets/icons/icon-chat.svg';
import BuyIcon from '@/assets/icons/BuyIcon.svg';
import StarIcon from '@/assets/icons/icon-star.svg';

type Analyst = {
  name: string;
  avatar: string;
  role: string;
  markets: string[];
  assets: string[];
  subscribers: number;
  rating: number;
  clients: number;
  analysis: string;
  price: number;
  accuracy: number;
  isPro: boolean;
};

interface IAnalystSmartCardProps {
  analyst: Analyst;
  className?: string;
}

const AnalystSmartCard: FC<IAnalystSmartCardProps> = ({ analyst, className }) => {
  const {
    name,
    avatar,
    role,
    markets,
    assets,
    subscribers,
    rating,
    clients,
    analysis,
    price,
    accuracy,
    isPro,
  } = analyst;

  const analystInfoList = [
    { label: 'Markets', value: markets.join(', ') },
    { label: 'Assets', value: assets.join(', ') },
    { label: 'Analysis', value: analysis },
  ];

  return (
    <Paper className='p-4'>
      <div className='pb-4 border-b-[1px] border-gunpowder'>
        <div className='relative'>
          <button className='absolute top-0 right-0 text-lighterAluminum hover:text-white focus:text-white cursor-pointer'>
            <StarIcon width={24} height={24} fill='none' />
          </button>
          <MockChart className='absolute bottom-0 left-0 w-full h-auto -z-[1]' />
          <Image
            src={avatar}
            width={96}
            height={96}
            alt={name}
            className='rounded-full max-w-24 h-auto object-cover'
          />
          <div className='flex items-center gap-x-3'>
            <h2 className='text-[31px] font-bold'>{name}</h2>
            {isPro && (
              <span className='inline-block px-1 text-[12px] font-extrabold bg-purple rounded-md'>
                PRO
              </span>
            )}
          </div>
          <span className='text-[12px] font-bold text-lighterAluminum uppercase'>
            Berkshire Hathaway
          </span>
          <div className='flex items-center gap-x-1 flex-wrap mt-2'>
            <TagLabel category='some' value={role} />
            <ProcentLabel value={rating} border withSymbols={false} />
            <SubCount personse={subscribers} />
            <NotesCount notes={clients} />
          </div>
        </div>
        <ul className='flex flex-col gap-y-2 mt-4'>
          {analystInfoList.map(({ label, value }) => (
            <li key={label} className='flex items-center gap-x-1 text-[12px] font-bold uppercase'>
              <span className='text-lighterAluminum'>{label}:</span>
              <span>{value}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className='flex flex-col gap-y-4 mt-4'>
        <span className='text-[12px] font-bold uppercase text-lighterAluminum'>
          Forecast accuracy: <ProcentLabel value={accuracy} classname='inline' />
        </span>
        <span className='text-[24px] font-bold'>{`$${price} / month`}</span>
        <div className='flex flex-col gap-y-4'>
          <Button className='flex items-center gap-x-2 max-h-[26px]'>
            <BuyIcon width={16} height={16} />
            Buy
          </Button>
          <Button ghost className='flex items-center gap-x-2 max-h-[26px]'>
            <ChatIcon width={16} height={16} />
            Chat
          </Button>
        </div>
      </div>
    </Paper>
  );
};

export default AnalystSmartCard;
