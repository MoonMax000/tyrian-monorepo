import type { Metadata } from 'next';
import { Nunito_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers/Providers';
import ClientLayout from './ClientLayout';

const nunitoSans = Nunito_Sans({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['cyrillic', 'latin'],
});

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
    <html lang='en'>
      <body className={nunitoSans.className}>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
