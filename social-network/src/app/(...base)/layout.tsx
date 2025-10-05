import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ClientLayout } from './ClientLayout';
export const metadata: Metadata = {
  title: 'Social Network',
  description: 'Social Network',
};

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div id='portal-root'></div>
      <div className='flex flex-col items-center h-screen mx-auto antialiased'>
        <Suspense fallback={<div>...Loading</div>}>
          <ClientLayout>{children}</ClientLayout>
        </Suspense>
      </div>
    </>
  );
}
