import clsx from 'clsx';
import { FC } from 'react';

interface IProps {
  value: number;
  toFixed?: number;
  border?: boolean;
  withSymbols?: boolean;
  classname?: string;
}

const ProcentLabel: FC<IProps> = ({
  value,
  border = false,
  withSymbols = true,
  toFixed = 1,
  classname,
}) => {
  return (
    <div
      className={clsx(
        classname,
        'w-max py-[2px] px-1 rounded text-[12px] leading-4 line-clamp-1 !font-bold',
        {
          'bg-[#2ebd8529]': value > 0 && border,
          'bg-[#ef454a29]': value < 0 && border,
          'text-green': value > 0,
          'text-red': value < 0,
          'bg-[#aaa8a829]': value === 0,
        },
      )}
    >
      {value > 0 && withSymbols && '+'}
      {value.toFixed(toFixed)}
      {withSymbols && '%'}
    </div>
  );
};

export default ProcentLabel;
