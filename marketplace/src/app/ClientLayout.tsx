'use client';

import dynamic from 'next/dynamic';
import { AppBackground } from '@/components/UI/AppBackground';
import { useState } from 'react';
import NewSidebar from '@/components/Layout/NewSidebar';
import RightSidebar from '@/components/Layout/RightSidebar';

// Dynamic import для Header и Footer чтобы избежать hydration error
const Header = dynamic(() => import('@tyrian/ui').then(mod => ({ default: mod.Header })), {
  ssr: false,
  loading: () => <div className="h-16 bg-black/80 backdrop-blur-xl" />
});

const Footer = dynamic(() => import('@tyrian/ui').then(mod => ({ default: mod.Footer })), {
  ssr: false
});

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [rightSidebarOpen, setRightSidebarOpen] = useState<boolean>(false);

  return (
    <AppBackground variant={'primal'}>
      <div className='relative min-h-screen bg-black text-white font-nunito flex flex-col overflow-x-hidden'>
        {/* Header with menu toggle for right sidebar */}
        <Header onMenuClick={() => setRightSidebarOpen(!rightSidebarOpen)} />

        {/* Main Layout - flex container matching original Portfolio structure */}
        <div className='relative z-10 flex justify-start pt-16 mb-60 overflow-x-visible'>
          {/* Left Sidebar */}
          <NewSidebar />

          {/* Main Content */}
          <main className='flex-1 min-w-0 px-6 lg:px-8'>
            <div id='portal-root' />
            <div className='min-h-[calc(100vh-4rem)] flex flex-col'>
              <div className='flex-1'>{children}</div>

              {/* Footer */}
              <Footer />
            </div>
          </main>

          {/* Right Sidebar - collapses to width 0 when closed */}
          <RightSidebar
            isOpen={rightSidebarOpen}
            onClose={() => setRightSidebarOpen(false)}
          />
        </div>
      </div>
    </AppBackground>
  );
}
