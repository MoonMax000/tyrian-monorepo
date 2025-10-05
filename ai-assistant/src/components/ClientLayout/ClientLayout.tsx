'use client';
import { FC, ReactNode } from 'react';
import { AppBackground } from '../ui/AppBackground';
import { Header } from '../ui/Header/Header';
import ContentWrapper from '../ui/ContentWrapper/ContentWrapper';
import Footer from '../ui/Footer/Footer';
import { usePathname } from 'next/navigation';
import { LayoutVariant } from '../ui/AppBackground/AppBackGround';
import UserHeader from '../UserHeader/UserHeader';
import { DashBoardHeader } from '../DashBoardHeader/DashBoardHeader';
const PagesBg: Record<LayoutVariant, string[]> = {
  primal: ['profile'],
  secondary: [
    'settings',
    'dashboard',
    'security',
    'notifications',
    'kyc',
    'billing',
    'referrals',
    'api',
    'profile_settings',
    'live-streaming',
    'social-network',
    'marketplace',
    'portfolios',
  ],
};

interface Props {
  children: ReactNode;
  contentWrapperClassname?: string;
  withUserHeader?: boolean;
}

export const ClientLayout: FC<Props> = ({
  children,
  contentWrapperClassname,
  withUserHeader = false,
}) => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const currentPage = segments[segments.length - 1] || '';
  const LayoutVariant: LayoutVariant = PagesBg.secondary.includes(currentPage)
    ? 'secondary'
    : 'primal';

  return (
    <AppBackground variant={LayoutVariant}>
      <Header />
      {LayoutVariant === 'secondary' && !withUserHeader && (
        <>
          <UserHeader
            className='rounded-none border-none'
            variant={LayoutVariant}
          />
          <DashBoardHeader />
        </>
      )}
      {withUserHeader && (
        <UserHeader
          className='rounded-none border-none'
          variant={LayoutVariant}
        />
      )}

      <div className='flex justify-start mb-60'>
        {/* NewNavBar removed - using Marketplace Shell */}
        <main className='flex-1'>
          <ContentWrapper className={contentWrapperClassname}>
            {children}
          </ContentWrapper>
        </main>
      </div>

      <Footer />
    </AppBackground>
  );
};
