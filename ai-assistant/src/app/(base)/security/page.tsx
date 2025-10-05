import { SecurityScreen } from '@/screens/security/Security';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security',
  description: 'Security',
};

export default function Security() {
  return <SecurityScreen />;
}
