'use client';

import { useEffect, useState } from 'react';
import Image from '@/components/UI/Image';
import Notification from './components/Notification';
import Profile from './components/Profile';
import { clearUserData, setUserData } from '@/store/slices/userSlice';
import Cookies from 'js-cookie';

import { useRouter } from 'next/navigation';
import { useGetProfileMeQuery } from '@/store/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useWebSocket } from '@/utilts/hooks/useWebSocket';
import { useGetUserByIdQuery } from '@/store/socialWebApi';
import AiIcon from '@/assets/icons/navbar/AIAssistant.svg';
import PurchaseIcon from '@/assets/icons/navbar/DividendCalendar.svg';
import ArrowButton from '@/assets/icons/navbar/ArrowButton.svg';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { connectWebSocket, disconnectWebSocket } from '@/store/slices/chatWebsocketSlice';
import { SearchBar } from './components/SearchBar';
import { SESSION_ID_COOKIE_NAME } from '@/constants/cookies';
import { useGetProfileQuery, useLogoutMutation } from '@/store/authApi';
import IconLogin from '@/assets/icons/button/icon-login.svg';
import ModalWrapper from '../UI/ModalWrapper';
import { CheckAuthModal } from './components/CheckAuthModal/CheckAuthModal';

export type TAuthorizationModal = 'login' | 'registration' | 'recovery' | null;

const Header = () => {
  const [token, setToken] = useState<string>('');
  const { push } = useRouter();
  const dispatch = useAppDispatch();
  const uidToken = useAppSelector((state) => state.user.id);
  const [authTimer, setAuthTimer] = useState<NodeJS.Timeout | null>(null);
  const [isOpenCheckModal, setIsOpenCheckModal] = useState(false);
  const [logoutUser] = useLogoutMutation();
  const { isSuccess } = useGetProfileQuery({});

  const messagesCount = useSelector((state: RootState) => state.websocket?.messages?.length);

  const handleLogin = () => {
    window.location.href =
      (process.env.NEXT_PUBLIC_AUTH_URL || 'https://auth.tyriantrade.com/') + 'socialweb';
  };

  useWebSocket(token ?? '');

  const { data: user } = useGetUserByIdQuery(uidToken ?? '', {
    skip: !uidToken,
  });

  const { data: userProfile } = useGetProfileMeQuery();

  // DISABLED: Auth modal timer - allows users to browse without time limit
  /* useEffect(() => {
    if (!isSuccess) {
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
        setIsOpenCheckModal(true);
        return;
      }

      if (savedTime) {
        const elapsed = currentTime - parseInt(savedTime, 10);
        timeLeft = Math.max(0, Number(process.env.NEXT_PUBLIC_TIMER_AUTH) || 30000 - elapsed);
      }

      const timeoutId = setTimeout(() => {
        setIsOpenCheckModal(true);
      }, timeLeft);

      setAuthTimer(timeoutId);
      localStorage.setItem(authCheckKey, currentTime.toString());
      localStorage.setItem(timeLeftKey, timeLeft.toString());
    } else {
      setIsOpenCheckModal(false);
    }

    return () => {
      if (authTimer) {
        clearTimeout(authTimer);
      }
    };
  }, [isSuccess]); */

  useEffect(() => {
    if (!userProfile) return;
    dispatch(setUserData(userProfile));
  }, [userProfile]);

  useEffect(() => {
    if (!user?.id) return;
    dispatch(connectWebSocket(`private_${user?.id}`));
    return () => {
      dispatch(disconnectWebSocket(`private_${user?.id}`));
    };
  }, [dispatch, user?.id]);

  useEffect(() => {
    setToken(Cookies.get(SESSION_ID_COOKIE_NAME) || '');
  }, []);

  return (
    <header className='max-w-[1920px] w-full px-[30px] pb-[18px] border-b-[2px] border-regaliaPurple custom-bg-blur z-[1000] relative'>
      <div className={'flex justify-between items-center pt-[18px] transition-all'}>
        <div className='flex flex-start items-center gap-[10px]'>
          <div
            onClick={() => {
              push('/popular');
            }}
          >
            <Image src='/logo.png' alt='Logo' className='cursor-pointer min-w-[35px]' />
          </div>
          <div className='text-[31px] font-bold'>Tyrian Trade</div>
        </div>

        <div className='flex flex-1 items-center justify-center gap-[16px]'>
          <SearchBar />
          <div className='flex flex-start items-center gap-[10px]'>
            <button className='w-[44px] h-[44px] rounded-[8px] bg-gradient-to-r from-darkPurple to-lightPurple border-darkPurple p-[10px]'>
              <AiIcon />
            </button>
            <span>AI Assistant</span>
          </div>
        </div>

        <div className='flex items-center justify-between'>
          {!userProfile ? (
            <div className='hover:cursor-pointer' onClick={handleLogin}>
              <IconLogin />
            </div>
          ) : (
            <>
              <div className='flex justify-between items-center gap-[10px] border border-regaliaPurple p-3 rounded-[8px]'>
                <PurchaseIcon className='w-[24px] h-[24px] text-lighterAluminum' />
                <div className='text-[15px] font-[500]'>$999,999,999.00</div>
              </div>

              <div className='flex items-center ml-3'>
                <select
                  className='appearance-none bg-transparent text-[15px] font-[500] text-white pr-1 pl-2 cursor-pointer focus:outline-none'
                  defaultValue='USD'
                >
                  <option className='text-black' value='USD'>
                    USD
                  </option>
                  <option className='text-black' value='EUR'>
                    EUR
                  </option>
                  <option className='text-black' value='BTC'>
                    BTC
                  </option>
                </select>
                <ArrowButton className='w-[20px] h-[20px] text-lighterAluminum' />
              </div>
            </>
          )}

          {userProfile && (
            <div className='flex items-center justify-end gap-2'>
              <Notification count={messagesCount} />
              <Profile
                // onClickAvatar={() => push(`/user/${uidToken}`)}
                userEmail={userProfile.email}
                onLogout={() => {
                  setToken('');
                  dispatch(clearUserData());
                  window.location.reload();
                  logoutUser({});
                }}
                enableDropdown={true}
              />
            </div>
          )}
        </div>
      </div>
      {isOpenCheckModal && (
        <ModalWrapper
          isOpen={isOpenCheckModal}
          onClose={() => setIsOpenCheckModal(false)}
          contentClassName='!pr-0 !overflow-hidden'
          title='Sign In to Have Access to All Materials of the Tyrian Community'
          className='!max-w-[400px] bg-[#0C101480] backdrop-blur-[100px] !rounded-3xl !p-6'
          withCloseIcon={false}
          isClosable={false}
        >
          <CheckAuthModal />
        </ModalWrapper>
      )}
    </header>
  );
};

export default Header;
