import { FC } from 'react';
import clsx from 'clsx';

interface PercentLabelProps {
  value: number;
  symbolAfter?: string;
  classes?: string;
  noBackground?: boolean;
  showSymbolBefore?: boolean;
}

const PercentLabel: FC<PercentLabelProps> = ({
  value,
  classes,
  symbolAfter,
  noBackground,
  showSymbolBefore = true,
}) => {
  const isPositive = value > 0;

  return (
    <p
      className={clsx('text-[12px] font-extrabold px-1 py-[2px] rounded-[4px] m-0', classes, {
        'text-red': !isPositive,
        'text-green': isPositive,
        'bg-darkRed': !isPositive && !noBackground,
        'bg-darkGreen': isPositive && !noBackground,
      })}
    >
      {isPositive && showSymbolBefore && '+'}
      {value}
      {symbolAfter && symbolAfter}
    </p>
  );
};

export default PercentLabel;
