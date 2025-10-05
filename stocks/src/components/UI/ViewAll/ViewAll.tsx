import ArrowRight from '@/assets/icons/mini-arrow-right.svg';
import { FC, ReactNode } from 'react';
import clsx from 'clsx';

interface Props {
  className?: string;
  children: string | ReactNode;
  onClick?: () => void;
}

export const ViewAll: FC<Props> = ({ className, children, onClick }) => {
  return (
    <span
      onClick={onClick}
      className={clsx(
        'flex text-[15px] font-bold text-purple items-center hover:underline cursor-pointer',
        className,
      )}
    >
      {children} <ArrowRight viewBox='2' />
    </span>
  );
};
