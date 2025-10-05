import Spinner from '@/components/UI/Loaders/Spinner';
import { AuthorizationService } from '@/services/AuthorizationService';
import { setCookie } from '@/utils/cookie';
import { redirect } from 'next/navigation';

const ActivatePage = async ({ params }: { params: Promise<{ uid: string; token: string }> }) => {
  const { token, uid } = await params;

  try {
    const { data } = await AuthorizationService.activateUser({ token, uid });
    setCookie('access-token', data.token);
    
    alert('Аккаунт активирован');
    redirect('/');
  } catch (err: unknown) {
    console.log('err', err);
    redirect('/');
  }

  return (
    <div className='fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-[#0c1014] z-[900]'>
      <Spinner className='!size-10' />
    </div>
  );
};

export default ActivatePage;
