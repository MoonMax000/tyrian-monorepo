import { headers } from 'next/headers'
import { Nunito_Sans } from 'next/font/google';
import './globals.css';
import { ReactQueryWrapper } from '@/components/ReactQueryWrapper';
import ClientLayout from './ClientLayout';
import { getSiteName } from '@/utils/getSiteName';

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
    title: 'Turian trade',
    alternates: {
      canonical: cleanPath,
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <html lang='en'>
      <body className={`${mainFont.className} antialiased relative`}>
        <ReactQueryWrapper>
          <ClientLayout>{children}</ClientLayout>
        </ReactQueryWrapper>
      </body>
    </html>
  );
}
