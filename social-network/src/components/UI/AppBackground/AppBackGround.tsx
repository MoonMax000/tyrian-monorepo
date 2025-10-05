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
    <div className='relative top-0 left-0 w-screen h-fit overflow-x-hidden'>
      <Image
        src='/images/BackgroundImages/left.png'
        width={1200}
        height={571}
        alt=''
        className='absolute left-[-1px] top-[575px] z-[-1]'
        draggable={false}
      />
      <Image
        src='/images/BackgroundImages/central.png'
        width='0'
        height={1254}
        alt=''
        sizes='90vw'
        className=' w-[83vw]  absolute right-0 top-10 z-[-1]
        '
        draggable={false}
      />
      <Image
        src='/images/BackgroundImages/bottom.png'
        alt={''}
        width='0'
        height={1232}
        sizes='100vw'
        className='w-full h-[1200px] absolute bottom-0'
      />

      {children}
    </div>
  );
};

const SecondaryBG: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className='relative top-0 left-0 w-screen h-fit overflow-x-hidden'>
      <Image
        src='/images/BackgroundImages/central.png'
        width='0'
        height='0'
        alt=''
        sizes='100vw'
        className='w-full h-[1245px] absolute left-0 top-0 scale-x-[-1]  z-[-1]
        '
        draggable={false}
      />
      <Image
        src='/images/BackgroundImages/bottom.png'
        alt={''}
        width='0'
        height={1232}
        sizes='100vw'
        className='w-full h-[1200px] absolute bottom-0  z-[-1]'
      />

      {children}
    </div>
  );
};
