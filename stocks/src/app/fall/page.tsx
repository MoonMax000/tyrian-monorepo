import Leader from '@/screens/Leader';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Лидеры падения',
};

const Volume = () => {
  return <Leader type='losers' />;
};

export default Volume;
