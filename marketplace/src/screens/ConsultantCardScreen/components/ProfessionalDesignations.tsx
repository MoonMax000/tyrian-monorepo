import type { FC } from 'react';

import Paper from '@/components/UI/Paper';
import TagLabel from '@/components/UI/TagLabel';

interface IDesignationsProps {
  designations: string[];
}

export const ProfessionalDesignations: FC<IDesignationsProps> = ({ designations }) => (
  <Paper className='p-4'>
    <h3 className='text-purple text-[19px] font-bold mb-4'>Professional designations</h3>
    <ul className='flex items-center flex-wrap gap-x-2'>
      {designations.map((item) => (
        <li key={item}>
          <TagLabel value={item} category='none' />
        </li>
      ))}
    </ul>
  </Paper>
);
