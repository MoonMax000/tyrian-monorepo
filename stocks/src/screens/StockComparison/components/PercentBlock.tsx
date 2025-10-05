import clsx from 'clsx';
import { FC } from 'react';

const PercentBlock: FC<{ percent: number }> = ({ percent }) => {
  return (
    <p
      className={clsx('text-body-12 font-semibold py-[2px] px-1 w-max', {
        'bg-darkGreen text-green': percent > 0,
        'bg-darkRed text-red': percent < 0,
      })}
    >
      {percent.toFixed(2)}%
    </p>
  );
};

export default PercentBlock;
