import type { FC } from 'react';

import DescriptionCard from '@/components/UI/DescriptionCard';

type Details = {
  type: string;
  industry: string;
  category: string;
  platform: string;
};

interface IDetailsProps {
  details: Details;
}

export const Details: FC<IDetailsProps> = ({ details }) => {
  const { type, industry, category, platform } = details;

  const detailsList = [
    { label: 'Type', value: type },
    { label: 'Industry', value: industry },
    { label: 'Category', value: category },
    { label: 'Platform', value: platform },
  ];

  return (
    <DescriptionCard title='Details'>
      <div className='grid grid-cols-2 gap-2'>
        {detailsList.map(({ label, value }) => (
          <div key={label} className='flex flex-col gap-y-2 font-bold'>
            <span className='text-[12px] uppercase text-lighterAluminum'>{label}</span>
            <span className='text-[15px]'>{value}</span>
          </div>
        ))}
      </div>
    </DescriptionCard>
  );
};
