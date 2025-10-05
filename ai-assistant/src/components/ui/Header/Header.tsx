'use client';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Search } from './Search';
import SearchIcon from '@/assets/search.svg';
import Button from '../Button/Button';
import BeautyIcon from '@/assets/beauty.svg';
import MockAvatar from '@/assets/mock-avatars/test-avatar.svg';
import Image from 'next/image';
import Logo from '@/assets/logo.png';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AuthService } from '@/services/AuthService';
import DropDownNav from '@/components/DropDownNav';
import Modal from '@/components/Modal';
import { AuthAll } from '@/components/AuthAll/AuthAll';
import { getMediaUrl } from '@/utilts/helpers/getMediaUrl';
import { RecoveryConfirm } from '@/components/modals/RecoveryConfirm/RecoveryConfirm';

interface HeaderProps {
  linkComponent?: ReactNode;
  logoLink?: string;
  profileLink?: string;
}

export const Header = ({ logoLink = '/' }: HeaderProps) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [authCheckModalOpen, setAuthCheckModalOpen] = useState(false);
  const [authTimer, setAuthTimer] = useState<NodeJS.Timeout | null>(null);
  const [isConfirmRecoveryModal, setIsConfirmRecoveryModal] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['getProfile', isConfirmRecoveryModal],
    queryFn: () => AuthService.getProfile(),
  });

  const { mutate: restoreAccount } = useMutation({
    mutationKey: ['restore'],
    mutationFn: () => AuthService.restoreAccount(),
  });

  const handleRestoreAccount = () => {
    restoreAccount();
    setIsConfirmRecoveryModal(false);
  };

  const { mutateAsync: logoutFunc } = useMutation({
    mutationKey: ['logout'],
    mutationFn: () => AuthService.logout(),
  });

  const handleLogout = useCallback(() => {
    window.location.reload();
    logoutFunc();
  }, [logoutFunc]);

  useEffect(() => {
    if (profile?.is_deleted) {
      setIsConfirmRecoveryModal(true);
      console.log('log');
    }
  }, [profile?.is_deleted]);

  // DISABLED: Auth modal timer - allows users to browse without time limit
  /* useEffect(() => {
    if (!isLoading && !profile?.id) {
      const authCheckKey = 'authCheckTime';
      const timeLeftKey = 'timeLeft';
      const savedTime = localStorage.getItem(authCheckKey);
      const currentTimeLeft = localStorage.getItem(timeLeftKey);
      const currentTime = Date.now();
      let timeLeft = Number(process.env.NEXT_PUBLIC_TIMER_AUTH) || 30000;

      if (currentTimeLeft) {
        timeLeft = Number(currentTimeLeft);
      }

      if (Number(savedTime) && timeLeft === 0) {
        setAuthCheckModalOpen(true);
        return;
      }

      if (savedTime) {
        const elapsed = currentTime - parseInt(savedTime, 10);
        timeLeft = Math.max(
          0,
          Number(process.env.NEXT_PUBLIC_TIMER_AUTH) || 30000 - elapsed,
        );
      }

      const timeoutId = setTimeout(() => {
        setAuthCheckModalOpen(true);
      }, timeLeft);

      setAuthTimer(timeoutId);
      localStorage.setItem(authCheckKey, currentTime.toString());
      localStorage.setItem(timeLeftKey, timeLeft.toString());
    }

    return () => {
      if (authTimer) {
        clearTimeout(authTimer);
      }
    };
  }, [isLoading]); */

  return (
    <>
      <header className='relative z-[1000] border-b-[2px] border-[#523A83] bg-[#0C101480] backdrop-blur-[100px]'>
        <div className='flex items-center w-full max-w-[1920px] justify-between mx-auto py-5 pl-[30px] pr-[30px] transition-all duration-300'>
          <div className='flex gap-[10px] min-w-[230px] items-center'>
            <a href={logoLink}>
              <Image
                width={35}
                height={40}
                className='w-[35px] h-[40px]'
                src={Logo.src}
                alt='logo'
              />
            </a>
            <span className='text-[31px] font-bold text-white'>
              Tyrian Trade
            </span>
          </div>
          <div className='flex gap-[10px]'>
            <Search
              wrapperClassName='min-w-[540px]'
              placeholder='Search'
              icon={<SearchIcon />}
              iconPosition='left'
            />
            <div className='flex gap-[10px] min-w-[150px] items-center'>
              <Button>
                <BeautyIcon className='w-[24px] h-[24px]' />
              </Button>
              <span className='font-medium text-[15px] text-white'>
                AI Assistant
              </span>
            </div>
          </div>
          <div className='flex items-center justify-between max-w-[350px]'>
            <div className='relative'>
              {profile ? (
                <div className='flex items-center justify-center gap-4'>
                  {/* <div className='relative'>
                    <span className='absolute bottom-4 left-3 bg-red text-white text-body-12 w-5 h-5 rounded-full flex items-center justify-center'>
                      4
                    </span>
                  </div> */}
                  {isDropdownVisible && (
                    <div className='absolute z-[100] top-[60px] w-[232px] right-0'>
                      <DropDownNav
                        logOut={handleLogout}
                        setDropdownVisible={setDropdownVisible}
                      />
                    </div>
                  )}

                  <a
                    href='/profile'
                    aria-label='Profile'
                    className='size-11 min-w-11 min-h-11 rounded-[50%]'
                    onClick={(e) => {
                      e.preventDefault();
                      setDropdownVisible((prev) => !prev);
                    }}
                  >
                    {profile?.avatar ? (
                      <Image
                        width={35}
                        height={40}
                        className='w-[44px] h-[44px] rounded-full'
                        src={getMediaUrl(profile.avatar)}
                        alt='logo'
                      />
                    ) : (
                      <MockAvatar />
                    )}
                  </a>
                </div>
              ) : (
                <button
                  className='w-[180px] h-[40px] text-white font-bold rounded-[8px] hover:opacity-50 cursor-pointer bg-purple'
                  onClick={() => {
                    const baseUrl =
                      process.env.NEXT_PUBLIC_AUTH_SERVICE_URL ||
                      'https://auth.tyriantrade.com/';
                    window.location.href = `${baseUrl}profile`;
                  }}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
        {authCheckModalOpen && (
          <Modal
            isOpen={authCheckModalOpen}
            onClose={() => setAuthCheckModalOpen(false)}
            contentClassName='!pr-0 !overflow-hidden'
            titleClassName='text-[24px] font-bold'
            title='Sign In to Have Access to All Materials of the Tyrian Community'
            className='!max-w-[400px] bg-[#0C101480] backdrop-blur-[100px] !rounded-3xl !p-6'
            withCloseIcon={false}
            isClosable={false}
          >
            <AuthAll />
          </Modal>
        )}
        {isConfirmRecoveryModal && (
          <Modal
            isOpen={isConfirmRecoveryModal}
            titleClassName='text-[24px]'
            contentClassName='!pr-0 !overflow-hidden !bg-transparent'
            title='Do you want to restore your account?'
            withCloseIcon={false}
            className='!max-w-[400px] !bg-[#0C1014] !backdrop-blur-[100px] !rounded-3xl p-6'
          >
            <RecoveryConfirm
              onClose={() => setIsConfirmRecoveryModal(false)}
              onSubmit={handleRestoreAccount}
            />
          </Modal>
        )}
      </header>
    </>
  );
};
