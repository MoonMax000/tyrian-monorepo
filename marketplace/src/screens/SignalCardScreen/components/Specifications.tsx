import type { FC } from 'react';

import DescriptionCard from '@/components/UI/DescriptionCard';
import List from '@/components/UI/List';

type Specifications = {
  strategy: string;
  exchanges: string[];
  assets: string[];
  risk: string;
  signals: string;
  stats: string;
};

interface ISpecificationsProps {
  specifications: Specifications;
}

export const Specifications: FC<ISpecificationsProps> = ({ specifications }) => {
  const { strategy, exchanges, assets, risk, signals, stats } = specifications;

  const characteristicsList = [
    { label: 'Strategy', value: strategy },
    { label: 'Exchanges', value: exchanges.join(', ') },
    { label: 'Assets', value: assets.join(', ') },
    { label: 'Risk', value: risk },
    { label: 'Signals', value: signals },
    { label: 'Stats', value: stats },
  ];

  return (
    <DescriptionCard title='Specifications'>
      <List list={characteristicsList.map(({ label, value }) => `${label}: ${value}`)} />
    </DescriptionCard>
  );
};
