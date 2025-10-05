'use client';
import { FC, ReactNode } from 'react';
import Image from 'next/image';

export type LayoutVariant = 'primal' | 'secondary';

export const AppBackground: FC<{
  children: ReactNode;
  variant?: LayoutVariant;
}> = ({ children, variant = 'primal' }) => {
  switch (variant) {
    case 'primal':
      return <PrimalBG>{children}</PrimalBG>;
    case 'secondary':
      return <SecondaryBG>{children}</SecondaryBG>;
  }
};

const PrimalBG: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className='relative top-0 left-0 w-screen h-fit overflow-x-hidden bg-black'>
      {children}
    </div>
  );
};

const SecondaryBG: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className='relative top-0 left-0 w-screen h-fit overflow-x-hidden bg-black'>
      {children}
    </div>
  );
};
