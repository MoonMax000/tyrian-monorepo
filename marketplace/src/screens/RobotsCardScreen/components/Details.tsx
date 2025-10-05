import type { FC } from 'react';
import Image from 'next/image';

import DescriptionCard from '@/components/UI/DescriptionCard';
import ProcentLabel from '@/components/UI/ProcentLabel';

import { getDateDiff } from '@/helpers/get-date-diff';

type Details = {
  user: {
    name: string;
    avatar: string;
    role: string;
  };
  runningDate: string;
  roiMonth: number;
  roiYear: number;
  aum: number;
  subscribers: number;
  platform: string;
  sector: string;
};

interface IDetailsProps {
  details: Details;
}

export const Details: FC<IDetailsProps> = ({ details }) => {
  const { user, runningDate, roiMonth, roiYear, aum, subscribers, platform, sector } = details;

  const now = new Date();

  const dateDiff = getDateDiff(new Date(runningDate), now);

  const detailsList = [
    {
      label: 'ROI Apy for 30 days',
      content: <ProcentLabel value={roiMonth} classname='!text-[15px]' />,
    },
    {
      label: 'aum (usdt)',
      content: <span className='text-[15px] font-bold'>{aum.toFixed(2)}</span>,
    },
    {
      label: 'platform',
      content: <span className='text-[15px] font-bold'>{platform}</span>,
    },
    {
      label: 'ROI Apy for 1 year',
      content: <ProcentLabel value={roiYear} classname='!text-[15px]' />,
    },
    {
      label: 'Subscribers',
      content: <span className='text-[15px] font-bold'>{subscribers}</span>,
    },
    {
      label: 'Sector',
      content: <span className='text-[15px] font-bold'>{sector}</span>,
    },
  ];

  return (
    <DescriptionCard title='Details'>
      <div className='flex items-center gap-x-8 flex-wrap'>
        <div className='flex items-center gap-x-2'>
          <Image
            src={user.avatar}
            alt={user.name}
            width={44}
            height={44}
            className='rounded-full'
          />
          <div className='flex flex-col gap-y-1 text-[15px]'>
            <span className='font-bold'>{user.name}</span>
            <span className='font-medium text-lighterAluminum'>{user.role}</span>
          </div>
        </div>
        <div className='flex flex-col gap-y-1'>
          <span className='text-[12px] font-bold uppercase text-lighterAluminum'>running time</span>
          <span className='text-[15px] font-medium text-purple'>{dateDiff}</span>
        </div>
      </div>
      <div className='grid grid-cols-3 gap-2 mt-8'>
        {detailsList.map(({ label, content }) => (
          <div key={label} className='flex flex-col gap-y-2'>
            <span className='text-[12px] font-bold uppercase text-lighterAluminum'>{label}</span>
            {content}
          </div>
        ))}
      </div>
    </DescriptionCard>
  );
};
