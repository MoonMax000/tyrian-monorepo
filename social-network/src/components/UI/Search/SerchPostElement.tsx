import clsx from 'clsx';
import { FC } from 'react';
import { SearchElementProps } from './types';

const SerchPostEl: FC<SearchElementProps> = ({ icon, date, title, label, classNames, onClick }) => {
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
      {icon}
      <div>
        {title && <span>{title}</span>}
        <div className='flex gap-2 text-[15px] items-center'>
          {label}
          {date && <span className='text-lighterAluminum text-[12px] font-bold'>{date}</span>}
        </div>
      </div>
    </div>
  );
};

export default SerchPostEl;
