import type { FC } from 'react';

import ProcentLabel from '@/components/UI/ProcentLabel';
import DescriptionCard from '@/components/UI/DescriptionCard';

import { getFormattedDate } from '@/helpers/get-formmatted-date';

type BestTrade = {
  asset: string;
  openedAt: string;
  closedAt: string | null;
  gain: number;
};

interface IBestTradesProps {
  bestTrade: BestTrade;
}

export const BestTrade: FC<IBestTradesProps> = ({ bestTrade }) => {
  const { asset, openedAt, closedAt, gain } = bestTrade;

  const bestTradesList = [
    { label: 'Asset', content: <span className='text-blue'>{asset}</span> },
    {
      label: 'Opened At',
      content: <span>{getFormattedDate(openedAt)}</span>,
    },
    {
      label: 'Closed At',
      content: <span>{closedAt ? getFormattedDate(closedAt) : '-'}</span>,
    },
    {
      label: 'Gain',
      content: <ProcentLabel value={gain} border toFixed={2} />,
    },
  ];

  return (
    <DescriptionCard title='Best Trade'>
      <ul className='flex flex-col gap-y-8 text-[15px] font-bold'>
        {bestTradesList.map(({ label, content }) => (
          <li key={label} className='flex items-center justify-between gap-x-4'>
            <span className='text-lighterAluminum font-medium'>{label}</span>
            {content}
          </li>
        ))}
      </ul>
    </DescriptionCard>
  );
};
