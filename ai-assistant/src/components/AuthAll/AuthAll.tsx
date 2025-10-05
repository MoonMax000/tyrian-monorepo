import React from 'react';

import { useRouter } from 'next/navigation';
import Button from '../ui/Button/Button';

export const AuthAll = () => {
  const { push } = useRouter();
  return (
    <div className='flex w-full gap-[10px] justify-center h-[44px]'>
      <Button
        className='min-w-[165px] border border-regaliaPurple bg-transparent text-[#B0B0B0] text-[15px] font-bold'
        onClick={() => {
          const baseUrl =
            process.env.NEXT_PUBLIC_AUTH_URL || 'https://auth.tyriantrade.com/';
          push(`${baseUrl}profile`);
        }}
      >
        Sign Up
      </Button>
      <Button
        className='min-w-[165px]  bg-[linear-gradient(270deg,#A06AFF_0%,#482090_100%)] text-[15px] font-bold'
        onClick={() => {
          const baseUrl =
            process.env.NEXT_PUBLIC_AUTH_URL || 'https://auth.tyriantrade.com/';
          push(`${baseUrl}profile`);
        }}
      >
        Sing In
      </Button>
    </div>
  );
};
