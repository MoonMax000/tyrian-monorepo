import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Crypto Currency',
};

export default function CryptoCurrency() {
  redirect('/crypto-currency/stocks');
}
