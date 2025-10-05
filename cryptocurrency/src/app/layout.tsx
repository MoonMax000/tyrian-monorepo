import { Nunito_Sans } from 'next/font/google';
import { Providers } from './providers';
import { headers } from 'next/headers';
import { getSiteName } from '@/utils/getSiteName';
import ClientLayout from './ClientLayout';
import './globals.css';

const mainFont = Nunito_Sans({
  subsets: ['latin', 'cyrillic'],
  weight: ['200', '300', '400', '600', '700', '800'],
  variable: '--font-nunito-sans',
});

export async function generateMetadata() {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';
  const cleanPath = pathname.split('?')[0];
  return {
    metadataBase: getSiteName(),
    title: 'AXA coinmarketcap',
    alternates: {
      canonical: cleanPath,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${mainFont.className} antialiased`}>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
