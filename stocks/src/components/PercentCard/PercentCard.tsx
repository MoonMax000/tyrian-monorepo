import clsx from 'clsx';
import React, { FC, ReactNode } from 'react';

interface Props {
  className?: string;
  classNameText?: string;
  children?: ReactNode | string;
  withLeftContent?: boolean;
  leftContent?: string;
}

export const PercentCard: FC<Props> = ({
  className,
  classNameText,
  children,
  withLeftContent = false,
  leftContent,
}) => {
  return (
    <div
      className={clsx(
        'inline-flex items-center justify-center w-[52px] h-[20px] rounded-[4px] bg-darkGreen py-[2px] px-1',
        className,
      )}
    >
      {withLeftContent && <span className='text-[12px] font-bold'>{leftContent}</span>}
      <span className={clsx('text-[12px] font-extrabold leading-none text-green', classNameText)}>
        {children ? children + '%' : '4.72%'}
      </span>
    </div>
  );
};
