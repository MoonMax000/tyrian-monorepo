import clsx from 'clsx';
import React, { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode | string;
  className?: string;
}

export const GradientGraphButton: FC<Props> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        'w-fit h-[36px] gap-2 rounded-lg flex items-center justify-center relative',
        className,
      )}
      style={{
        padding: '8px 14px',
        border: '1px solid transparent',
        backgroundClip: 'padding-box',
      }}
    >
      <div
        className='absolute w-[49px] h-[36px] rounded-lg z-[-1]'
        style={{
          background: 'linear-gradient(270deg, #A06AFF 0%, #482090 100%)',
          padding: '1px',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
        }}
      ></div>
      {children}
    </div>
  );
};
