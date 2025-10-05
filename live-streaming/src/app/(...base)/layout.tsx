'use client';
import ToastNotification from '@/components/Notifications/ToastNotification';
import ToastPortal from '@/components/ToastPortal/ToastPortal';

import { Suspense } from 'react';

export default function BaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Suspense fallback={<div>...Loading</div>}>
        {children}
      </Suspense>
      <ToastPortal />
      <ToastNotification />
    </>
  );
}
