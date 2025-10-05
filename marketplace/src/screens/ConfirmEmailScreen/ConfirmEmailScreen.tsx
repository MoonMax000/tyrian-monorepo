'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthorizationService } from '@/services/AuthorizationService';
import { setCookie } from '@/utils/cookie';

const ConfirmEmailScreen = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  console.log(token);

  useEffect(() => {
    const activateAccount = async () => {
      if (!token) return;
      try {
        const { data } = await AuthorizationService.activateUser(token);

        setCookie('access-token', data.token);
        alert('Account successfully activated');
        router.push('/');
      } catch (err) {
        console.log('Activation error:', err);
        alert('Account activation error');
        router.push('/');
      }
    };

    activateAccount();
  }, [token, router]);

  return (
    <div className='fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-[#0c1014] z-[900] gap-2'>
      <p className='mt-4 text-white'>Account activation in progress...</p>
    </div>
  );
};
export default ConfirmEmailScreen;
