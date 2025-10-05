import type { FC } from 'react';

import DescriptionCard from '@/components/UI/DescriptionCard';

interface IDescriptionProps {
  description: string;
}

export const Description: FC<IDescriptionProps> = ({ description }) => (
  <DescriptionCard title='Description'>
    <p className='text-[15px] font-medium'>{description}</p>
  </DescriptionCard>
);
