import React from 'react';
import Container from '@/components/UI/Container';
import TabLinks, { TabLinksItem } from '@/components/UI/TabLinks';
import { CryptoCurrencyBackground } from '@/components/Backgrounds';

const links: TabLinksItem[] = [
  {
    label: 'Stocks',
    href: 'stocks',
  },
  {
    label: 'Crypto',
    href: 'crypto',
  },
  {
    label: 'ETFs',
    href: 'etfs',
  },
  {
    label: 'Commodities',
    href: 'commodities',
  },
  {
    label: 'Bonds',
    href: 'bonds',
  },
];

export default function CryptoLayout({ children }: React.PropsWithChildren) {
  return (
    <Container className='mb-15 lg:mb-[242px]'>
      <CryptoCurrencyBackground />
      <TabLinks className='mx-auto max-w-[519px]' items={links} />
      {children}
    </Container>
  );
}
