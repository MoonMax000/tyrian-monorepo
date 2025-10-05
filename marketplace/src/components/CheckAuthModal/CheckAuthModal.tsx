import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '../UI/Button/Button';
import { TAuthorizationModal } from '@/types/auth';

interface CheckAuthModalProps {
  setAuthorizationModalType?: (type: TAuthorizationModal) => void;
}

export const CheckAuthModal: React.FC<CheckAuthModalProps> = ({ setAuthorizationModalType }) => {
  const { push } = useRouter();
  
  const handleClick = () => {
    if (setAuthorizationModalType) {
      setAuthorizationModalType('login');
    } else {
      // Fallback to Auth Server
      window.location.href = 'http://localhost:8001/api/accounts/google/';
    }
  };
  
  return (
    <div className='flex flex-col gap-[24px]'>
      <h1 className='text-[24px] font-bold'>
        Sign In to Have Access to All Materials of the Tyrian Community
      </h1>
      <div className='flex w-full gap-[10px] justify-center h-[44px]'>
        <Button
          className='min-w-[165px] border border-regaliaPurple bg-transparent text-[#B0B0B0] text-[15px] font-bold'
          onClick={handleClick}
        >
          Sign Up
        </Button>
        <Button
          className='min-w-[165px]  bg-[linear-gradient(270deg,#A06AFF_0%,#482090_100%)] text-[15px] font-bold'
          onClick={handleClick}
        >
          Sing In
        </Button>
      </div>
    </div>
  );
};
