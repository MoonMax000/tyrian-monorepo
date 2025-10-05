import type { Metadata } from 'next';
import '../globals.css';
import { ClientLayout } from '@/components/ClientLayout/ClientLayout';
import { TabsComponent } from '@/components/Tabs/Tabs';

export const metadata: Metadata = {
  title: 'Profile service',
  description: 'Profile service',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClientLayout withUserHeader contentWrapperClassname='max-w-[1606px]'>
      <TabsComponent>{children}</TabsComponent>
    </ClientLayout>
  );
}
