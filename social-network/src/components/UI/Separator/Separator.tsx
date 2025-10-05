import clsx from 'clsx';
import { SeparatorProps } from '@/components/UI/Separator/types';

const Separator = ({ className }: SeparatorProps) => {
  return (
    <div className={clsx('w-full h-[1px] bg-white opacity-10', className)}></div>
  );
};

export default Separator;