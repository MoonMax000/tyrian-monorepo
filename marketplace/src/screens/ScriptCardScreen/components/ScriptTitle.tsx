import type { FC } from 'react';

import Paper from '@/components/UI/Paper';

import StarIcon from '@/assets/icons/icon-star.svg';

interface IScriptTitleProps {
  scriptName: string;
}

export const ScriptTitle: FC<IScriptTitleProps> = ({ scriptName }) => (
  <Paper className='p-4 flex items-center justify-between gap-x-6'>
    <h1 className='text-[31px] font-bold'>{scriptName}</h1>
    <button className='text-lighterAluminum hover:text-white focus:text-white'>
      <StarIcon width={24} height={24} fill='none' />
    </button>
  </Paper>
);
