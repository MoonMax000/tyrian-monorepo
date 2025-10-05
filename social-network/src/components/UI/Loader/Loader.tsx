import { cn } from '@/utilts/cn';
import { FC } from 'react';

interface Props {
  className?: string;
}

const Loader: FC<Props> = ({ className }) => {
  return (
    <div
      className={cn(
        'size-[44px] border-4 border-purple border-t-transparent rounded-full animate-spin',
        className,
      )}
    ></div>
  );
};

export default Loader;
