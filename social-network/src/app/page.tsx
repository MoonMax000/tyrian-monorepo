import { redirect, RedirectType } from 'next/navigation';

export default function Home() {
  redirect('/popular', RedirectType.replace);
  return <></>;
}
