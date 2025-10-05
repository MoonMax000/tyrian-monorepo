import { FC } from 'react';
import LoginModal from './LoginModal';
import RegistrationModal from './RegistrationModal';
import authorizationAdvertisementBackground from '@/assets/authorization-advertisement-background.png';
import RecoveryModal from './RecoveryModal';
import { TAuthorizationModal } from '@/types/authorization';

import LogoIcon from '@/assets/new-logo.svg';
import GoogleIcon from '@/assets/icons/sochial-web/google.svg';
import ApleIcon from '@/assets/icons/sochial-web/aple.svg';
import QrIcon from '@/assets/icons/qr.svg';
import TelegramIcon from '@/assets/icons/sochial-web/tg.svg';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/Tabs';

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

const LoginModalWrapper: FC<{
  type: TAuthorizationModal;
  onModalChange: (type: TAuthorizationModal) => void;
}> = ({ type, onModalChange }) => {
  const pageData = {
    login: {
      title: 'Войти',
      component: <LoginModal onModalChange={onModalChange} />,
      footerText: (
        <p className='mt-4 text-center flex gap-1 font-semibold'>
          <span className='opacity-[48%] font-bold text-sm'>Еще не зарегистрированы?</span>
          <span
            onClick={() => onModalChange('registration')}
            className='text-purple text-sm underline'
          >
            Зарегистрироваться
          </span>
        </p>
      ),
      footerAction: () => onModalChange('registration'),
    },
    registration: {
      title: 'Создать аккаунт',
      component: <RegistrationModal />,
      footerText: (
        <p className='mt-4 text-center flex gap-1 font-semibold justify-center'>
          <span className='opacity-[48%] font-bold text-sm'>Уже есть аккаунт?</span>
          <span onClick={() => onModalChange('login')} className='text-purple text-sm underline'>
            Авторизоваться
          </span>
        </p>
      ),
      footerAction: () => onModalChange('login'),
    },
    recovery: {
      title: 'Восстановление пароля',
      component: <RecoveryModal onModalChange={onModalChange} />,
      footerText: (
        <p className='mt-4 text-center flex gap-1 font-semibold justify-center'>
          <span onClick={() => onModalChange('login')} className='text-purple text-sm underline'>
            Авторизоваться
          </span>
        </p>
      ),
      footerAction: () => onModalChange('login'),
    },
  };
  return (
    <div className='grid grid-cols-2 items-center w-full max-w-[768px] mx-auto bg-blackedGray rounded-[16px]'>
      <div className='px-6 py-[70px]'>
        {type && (
          <>
            <h2 className='text-2xl font-semibold text-center mb-6'>{pageData[type].title}</h2>
            <div>
              <Tabs defaultValue='email'>
                <TabsList className='flex border-b-0 justify-between items-center mb-4'>
                  <div className='flex items-center gap-2 '>
                    <TabsTrigger
                      value='email'
                      className='text-4 font-semiboldx py-1 border-b-4 border-transparent text-gray-500 !px-0'
                    >
                      Email
                    </TabsTrigger>
                    <TabsTrigger
                      value='phone'
                      className='text-4 font-semibold  py-1 border-b-4 border-transparent text-gray-500 !px-0'
                    >
                      Телефон
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
          <div className='flex gap-1 justify-start items-center'>
            <div className='max-w-[77px] h-[1px] w-full bg-[#FFFFFF14]'></div>
            <span className='opacity-[48%] font-bold text-sm'>или войдите с помощью</span>
            <div className='max-w-[77px] h-[1px] w-full bg-[#FFFFFF14]'></div>
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
          <div role='button' className='' onClick={pageData[type].footerAction}>
            {pageData[type].footerText}
          </div>
        )}
      </div>

      <div
        className='bg-[#FFFFFF05] backdrop-blur-[240px] py-[70px] px-6 rounded-r-xl bg-cover h-full'
        style={{ backgroundImage: `url(${authorizationAdvertisementBackground.src})` }}
      >
        <LogoIcon width={100} height={128} alt='logo' className='mx-auto mb-12' />
        <h2 className='text-title text-center'>Присоединяйся к 100 000+ комьюнити AXA Stocks </h2>
        <p className='mt-4 text-[15px] leading-5 opacity-[48%] font-bold text-center'>
          Станьте частью активного сообщества инвесторов и трейдеров. Мы предлагаем различные
          тарифы, включая 7 дней бесплатного доступа! Откройте все функции платформы, получайте
          советы и делитесь опытом. Улучшайте свои инвестиционные навыки с AXA Stocks!
        </p>
      </div>
    </div>
  );
};

export default LoginModalWrapper;
