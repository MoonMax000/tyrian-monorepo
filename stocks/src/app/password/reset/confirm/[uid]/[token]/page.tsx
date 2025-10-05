import ResetPasword from '@/components/ResetPassword';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Смена пароля',
};

const ChangePasswordPage = async ({
  params,
}: {
  params: Promise<{ uid: string; token: string }>;
}) => {
  const { token, uid } = await params;
  return <>{token && uid && <ResetPasword uid={uid} token={token} />}</>;
};

export default ChangePasswordPage;
