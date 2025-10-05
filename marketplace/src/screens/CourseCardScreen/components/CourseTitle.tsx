import type { FC } from 'react';

import Paper from '@/components/UI/Paper';

import StarIcon from '@/assets/icons/icon-star.svg';

interface ICourseTitleProps {
  courseName: string;
}

export const CourseTitle: FC<ICourseTitleProps> = ({ courseName }) => (
  <Paper className='p-4 flex items-center justify-between gap-x-6 mb-6'>
    <h1 className='text-[31px] font-bold'>{courseName}</h1>
    <button className='text-lighterAluminum hover:text-white focus:text-white'>
      <StarIcon width={24} height={24} fill='none' />
    </button>
  </Paper>
);
