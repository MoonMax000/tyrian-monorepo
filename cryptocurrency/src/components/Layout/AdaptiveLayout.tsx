'use client';

import { ReactNode } from 'react';
import { Sidebar, useSidebar } from '@/components/Sidebar';
import { Header, Footer } from '@tyrian/ui';

interface AdaptiveLayoutProps {
  children: ReactNode;
}

const AdaptiveLayout = ({ children }: AdaptiveLayoutProps) => {
  const { isOpen } = useSidebar();

  return (
    <div className='flex flex-col'>
      <Header />
      <div className='relative flex'>
        {/* NewNavBar removed - using Marketplace Shell */}
        <div className='flex-1'>
          <Sidebar />
          <div
            className={`transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-[120px]' : ''}`}
          >
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdaptiveLayout;
