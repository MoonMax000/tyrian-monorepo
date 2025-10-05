import './globals.css';
import { ReactQueryWrapper } from '@/components/ReactQueryWrapper';
import { mainFont } from './fonts';
import ClientLayout from './ClientLayout';
import { headers } from 'next/headers';
import { getSiteName } from '@/utils/getSiteName';

export async function generateMetadata() {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';
  const cleanPath = pathname.split('?')[0];
  return {
    metadataBase: getSiteName(),
    title: 'Marketplace',
    description: 'Marketplace',
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
      <body className={mainFont.className}>
        <ReactQueryWrapper>
          <ClientLayout>{children}</ClientLayout>
        </ReactQueryWrapper>
      </body>
    </html>
  );
}
