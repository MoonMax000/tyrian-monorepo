import type { FC } from 'react';

import DescriptionCard from '@/components/UI/DescriptionCard';

type Details = {
  type: string;
  industry: string;
  instructions: string;
};

interface IDetailsProps {
  details: Details;
}

export const Details: FC<IDetailsProps> = ({ details }) => (
  <DescriptionCard title='Details'>
    <div className='grid grid-cols-3 gap-x-4'>
      {Object.keys(details).map((key) => (
        <div key={key} className='flex flex-col gap-y-1'>
          <span className='text-[12px] uppercase font-bold text-lighterAluminum'>{key}</span>
          <span className='text-[15px] font-bold'>{details[key as keyof Details]}</span>
        </div>
      ))}
    </div>
  </DescriptionCard>
);
