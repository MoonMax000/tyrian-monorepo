import clsx from 'clsx';
import { FC } from 'react';

interface IProps {
  value: string;
  category: 'good' | 'midle' | 'some' | 'none' | 'strange';
  classname?: string;
}

const TagLabel: FC<IProps> = ({ value, category, classname }) => {
  return (
    <div
      className={clsx(
        'w-max px-1 py-[2px] rounded-[4px] text-xs font-semibold uppercase flex items-center justify-center',
        {
          'text-green bg-[#2EBD8529]': category === 'good',
          'text-blue bg-[#6AA5FF29]': category === 'midle',
          'text-orange bg-[#FFA80029]': category === 'some',
          'text-white bg-gunpowder': category === 'none',
          'text-purple bg-[#A06AFF29]': category === 'strange',
        },
        classname,
      )}
    >
      {value}
    </div>
  );
};

export default TagLabel;
