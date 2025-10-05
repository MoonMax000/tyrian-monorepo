import { FC } from 'react';
import LoginModal from './LoginModal';
import RegistrationModal from './RegistrationModal';
import authorizationAdvertisementBackground from '@/assets/authorization-advertisement-background.png';
import RecoveryModal from './RecoveryModal';
import { TAuthorizationModal } from '../../Header';
import LogoIcon from '@/assets/icons/modals/logo.svg';
import GoogleIcon from '@/assets/icons/sochial-web/google.svg';
import ApleIcon from '@/assets/icons/sochial-web/aple.svg';
import QrIcon from '@/assets/icons/qr.svg';
import TelegramIcon from '@/assets/icons/sochial-web/tg.svg';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/Tabs';

const LoginModalWrapper: FC<{
  type: TAuthorizationModal;
  onModalChange: (type: TAuthorizationModal) => void;
}> = ({ type, onModalChange }) => {
  const SOCIAL_NETWORKS = [
    { icon: <GoogleIcon width={24} height={24} />, link: '' },
    { icon: <ApleIcon width={20} height={24} />, link: '' },
    { icon: <TelegramIcon width={24} height={24} />, link: '' },
  ];
  const pageData = {
    login: {
      title: 'Log In',
      component: <LoginModal onModalChange={onModalChange} />,
      footerText: (
        <p className='mt-4 text-center flex gap-1 font-semibold'>
          <span className='opacity-[48%] font-bold text-sm'>Not registered yet?</span>
          <span
            onClick={() => onModalChange('registration')}
            className='text-[#a06aff] text-sm underline'
          >
            Sign Up
          </span>
        </p>
      ),
      footerAction: () => onModalChange('registration'),
    },
    registration: {
      title: 'Create an Account',
      component: <RegistrationModal />,
      footerText: (
        <p className='mt-4 text-center flex gap-1 font-semibold justify-center'>
          <span className='opacity-[48%] font-bold text-sm'>Already have an account?</span>
          <span onClick={() => onModalChange('login')} className='text-[#a06aff] text-sm underline'>
            Log In
          </span>
        </p>
      ),
      footerAction: () => onModalChange('login'),
    },
    recovery: {
      title: 'Password Recovery',
      component: <RecoveryModal onModalChange={onModalChange} />,
      footerText: (
        <p className='mt-4 text-center flex gap-1 font-semibold justify-center'>
  <span onClick={() => onModalChange('login')} className='text-[#a06aff] text-sm underline'>
    Log In
  </span>
</p>

      ),
      footerAction: () => onModalChange('login'),
    },
  };
  return (
    <div className='grid grid-cols-2 items-center'>
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
                      Phone
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
            <span className='opacity-[48%] font-bold text-sm'>or log in using</span>
            <div className='max-w-[77px] h-[1px] w-full bg-[#FFFFFF14]'></div>
          </div>
          <div className='flex items-center justify-center gap-8 mt-4'>
            {SOCIAL_NETWORKS.map((item, index) => {
              return (
                <div
                  key={index}
                  className='bg-[#272A32] w-12 h-12 rounded-full flex items-center justify-center'
                >
                  {item.icon}
                </div>
              );
            })}
          </div>
        </div>

        {type && (
          <div
            role='button'
            className='mt-4 text-center font-bold text-sm'
            onClick={pageData[type].footerAction}
          >
            {pageData[type].footerText}
          </div>
        )}
      </div>

      <div
        className='bg-[#FFFFFF05] backdrop-blur-[240px] py-[70px] px-6 rounded-r-xl bg-cover h-full'
        style={{ backgroundImage: `url(${authorizationAdvertisementBackground.src})` }}
      >
        <LogoIcon width={100} height={128} alt='logo' className='mx-auto mb-12' />
        <h2 className='text-title text-center'>Join the 100,000+ AXA Stocks Community</h2>
        <p className='mt-4 text-[15px] leading-5 opacity-[48%] font-bold text-center'>
          Become part of a vibrant community of investors and traders. We offer various plans,
          including a 7-day free trial! Unlock all platform features, get expert advice, and share
          your experience. Improve your investing skills with AXA Stocks!
        </p>
      </div>
    </div>
  );
};

export default LoginModalWrapper;
