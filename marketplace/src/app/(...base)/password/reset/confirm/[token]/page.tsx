import ResetPasword from '@/components/ResetPassword';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Change Password Page',
};

const ChangePasswordPage = async ({ params }: { params: Promise<{ token: string }> }) => {
  const { token } = await params;
  return <>{token ? <ResetPasword token={token} /> : <></>}</>;
};

export default ChangePasswordPage;
