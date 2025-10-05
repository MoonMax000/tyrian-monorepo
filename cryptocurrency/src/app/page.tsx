import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  const state = cookies();
  if ((await state).get('ACCESS_TOKEN')?.value) {
    redirect('/home');
  } else {
    redirect('/home');
  }
  return <main className='flex flex-col items-center justify-between'></main>;
}
