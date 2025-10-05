'use client';
import { FC } from 'react';
import LoginModal from './LoginModal';
import RegistrationModal from './RegistrationModal';
import authorizationAdvertisementBackground from '@/assets/authorization-advertisement-background.png';
import RecoveryModal from './RecoveryModal';
import GoogleIcon from '@/assets/icons/sochial-web/google.svg';
import ApleIcon from '@/assets/icons/sochial-web/aple.svg';
import QrIcon from '@/assets/icons/qr.svg';
import TelegramIcon from '@/assets/icons/sochial-web/tg.svg';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/Tabs';

import Image from 'next/image';
import { TAuthorizationModal } from '@/types/auth';

const LoginModalWrapper: FC<{
  type: TAuthorizationModal;
  onModalChange: (type: TAuthorizationModal) => void;
}> = ({ type, onModalChange }) => {
  // Google OAuth handler
  const handleGoogleLogin = async () => {
    try {
      const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:8001';
      const response = await fetch(`${authUrl}/api/accounts/google/`);
      const data = await response.json();
      
      // Редиректим на Google OAuth URL
      if (data.auth_url) {
        window.location.href = data.auth_url;
      } else {
        console.error('No auth_url in response:', data);
      }
    } catch (error) {
      console.error('Google OAuth error:', error);
    }
  };

  const SOCIAL_NETWORKS = [
    { 
      icon: <GoogleIcon width={24} height={24} />, 
      onClick: handleGoogleLogin,
      name: 'Google'
    },
    { 
      icon: <ApleIcon width={20} height={24} />, 
      onClick: () => console.log('Apple login - coming soon'),
      name: 'Apple'
    },
    { 
      icon: <TelegramIcon width={24} height={24} />, 
      onClick: () => console.log('Telegram login - coming soon'),
      name: 'Telegram'
    },
  ];
  const pageData = {
    login: {
      title: 'Sign In',
      component: <LoginModal onModalChange={onModalChange} />,
      footerText: (
        <p className='mt-4 justify-center items-center flex gap-1 font-semibold'>
          <span className='opacity-[48%] font-bold text-body-15'>New here? </span>
          <span
            onClick={() => onModalChange('registration')}
            className='text-purple text-body-15 underline'
          >
            Create an account
          </span>
        </p>
      ),
      footerAction: () => onModalChange('registration'),
    },
    registration: {
      title: 'Sign In',
      component: <RegistrationModal />,
      footerText: (
        <p className='mt-4 text-center flex gap-1 font-semibold justify-center'>
          <span className='opacity-[48%] font-bold text-body-15'>Already have an account?</span>
          <span
            onClick={() => onModalChange('login')}
            className='text-purple text-body-15 underline'
          >
            Login
          </span>
        </p>
      ),
      footerAction: () => onModalChange('login'),
    },
    recovery: {
      title: 'Password recovery',
      component: <RecoveryModal onModalChange={onModalChange} />,
      footerText: (
        <p className='mt-4 text-center flex gap-1 font-semibold justify-center'>
          <span
            onClick={() => onModalChange('login')}
            className='text-purple text-body-15 underline'
          >
            Login
          </span>
        </p>
      ),
      footerAction: () => onModalChange('login'),
    },
  };
  return (
    <div className='grid grid-cols-2 items-center w-full max-w-[768px] mx-auto bg-blackedGray rounded-[16px]'>
      <div className='px-6 pt-8 pb-[27px]'>
        {type && (
          <>
            <h4 className='text-2xl font-bold text-center mb-6'>{pageData[type].title}</h4>
            <div>
              <Tabs defaultValue='email'>
                <TabsList className='flex border-b-0 justify-between items-center mb-4'>
                  <div className='flex items-center gap-2 '>
                    <TabsTrigger
                      value='email'
                      className='text-4 font-semibold py-1 border-b-4 border-transparent text-gray-500 !px-0'
                    >
                      Email
                    </TabsTrigger>
                    <TabsTrigger
                      value='phone'
                      className='text-4 font-semibold  py-1 border-b-4 border-transparent text-gray-500 !px-0'
                    >
                      Telephone
                    </TabsTrigger>
                  </div>
                  <div className='bg-[#272A32] rounded-lg w-[40px] h-[40px] flex items-center justify-center'>
                    <QrIcon width={24} height={24} color={'white'} />
                  </div>
                </TabsList>
                <TabsContent value='email'>{pageData[type].component}</TabsContent>
                <TabsContent value='phone'>{pageData[type].component}</TabsContent>
              </Tabs>
            </div>
          </>
        )}
        <div className='mt-4'>
          <div className='flex gap-1 justify-center items-center'>
            <div className='max-w-[80px] h-[1px] w-full bg-onyxGrey'></div>
            <span className='opacity-[48%] font-bold text-body-15'>or sign in with</span>
            <div className='max-w-[80px] h-[1px] w-full bg-onyxGrey'></div>
          </div>
          <div className='flex items-center justify-center gap-8 mt-4'>
            {SOCIAL_NETWORKS.map((item, index) => {
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  title={`Sign in with ${item.name}`}
                  className='bg-[#272A32] w-12 h-12 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#363943] transition-all hover:scale-110 active:scale-95'
                >
                  {item.icon}
                </button>
              );
            })}
          </div>
        </div>

        {type && (
          <div
            role='button'
            className='mt-4 text-center font-bold text-body-15'
            onClick={pageData[type].footerAction}
          >
            {pageData[type].footerText}
          </div>
        )}
      </div>

      <div
        className='bg-[#FFFFFF05] backdrop-blur-[240px] pt-8 pb-[27px] px-6 rounded-r-xl bg-cover h-full'
        style={{ backgroundImage: `url(${authorizationAdvertisementBackground.src})` }}
      >
        <div className='w-[100px] mx-auto mb-12'>
          <Image src='/logo.png' alt='Logo' className='cursor-pointer' width={128} height={240} />
        </div>
        <h2 className='text-2xl font-bold text-center'>
          Join 100,000+ Tyrian Trade Community Members
        </h2>
        <p className='mt-4 text-[15px] font-bold opacity-[48%] text-center'>
          Become part of an active community of investors and traders. We offer various tariffs,
          including 7 days of free access! Unlock all the platform’s features, get tips and share
          experiences. Improve your investment skills with Tyrian Trade!
        </p>
      </div>
    </div>
  );
};

export default LoginModalWrapper;
