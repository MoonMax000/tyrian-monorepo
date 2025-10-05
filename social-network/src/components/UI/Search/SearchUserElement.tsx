import clsx from 'clsx';
import { FC } from 'react';
import { SearchElementProps } from './types';
import MarkIcon from '@/assets/icons/user/mark.svg';

const SerchUserElement: FC<SearchElementProps> = ({ icon, title, label, classNames, onClick }) => {
  const handleClick = () => {
    if (onClick) onClick();
  };
  return (
    <div
      onClick={handleClick}
      className={clsx(
        'flex gap-2 py-4 px-3 w-full hover:bg-gunpowder cursor-pointer items-center',
        classNames,
      )}
    >
      <div className='min-w-[192px] flex gap-[2px]'>
        {icon}
        <div>
          <div className='flex items-center gap-1'>
            {title && <span className='text-[15px] font-semibold'>{title}</span>} <MarkIcon />
          </div>
          <div className='flex gap-2 text-[15px]'>
            <span className='text-[15px] font-medium text-lighterAluminum lowercase'>
              @{label}{' '}
            </span>
          </div>
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <div className='w-[1px] h-[37px] bg-regaliaPurple ' />
        <div className='flex flex-col'>
          <p className='uppercase  text-lighterAluminum text-xs font-semibold'>followers</p>
          <p className='text-[15px] font-semibold'>3,098</p>
        </div>
      </div>
    </div>
  );
};

export default SerchUserElement;
