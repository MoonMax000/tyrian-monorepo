import { FC } from 'react';
import clsx from 'clsx';

interface ProcentLabelProps {
  value: number;
  symbolAfter?: string;
  symbolBefore?: string;
  noBackground?: boolean;
  className?: string;
}

const ProcentLabel: FC<ProcentLabelProps> = ({ value, symbolAfter, symbolBefore, noBackground, className }) => {
  const isPositive = value > 0;

  return (
    <p
      className={clsx(
        'text-[15px] leading-5 font-bold px-1 py-[2px] rounded',
        {
          'text-[#EF454A]': !isPositive,
          'text-[#2EBD85]': isPositive,
          'bg-[#EF454A29]': !isPositive && !noBackground,
          'bg-[#2EBD8529]': isPositive && !noBackground,
        },
        className,
      )}
    >
      {symbolBefore && symbolBefore}
      {isPositive && '+'}
      {Math.round(value * 100) / 100}
      {symbolAfter && symbolAfter}
    </p>
  );
};

export default ProcentLabel;
