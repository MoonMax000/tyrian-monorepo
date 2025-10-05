import Leader from '@/screens/Leader';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Самые волатильные акции',
};

const Volume = () => {
  return <Leader type='volatile' />;
};

export default Volume;
