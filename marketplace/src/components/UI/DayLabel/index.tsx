import { FC } from 'react';
import clsx from 'clsx';

interface DayLabelProps {
  days: number;
  className?: string;
}

const DayLabel: FC<DayLabelProps> = ({ days, className }) => {
  return (
    <p
      className={clsx(
        'px-[6px] rounded-[4px] text-xs border-[1px] flex items-center justify-center opacity-45',
        className,
      )}
    >
      {days}Д
    </p>
  );
};

export default DayLabel;
