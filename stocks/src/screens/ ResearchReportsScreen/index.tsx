'use client';
import Container from '@/components/UI/Container';
import Image from 'next/image';
import SocialNetworks from '../NewsScreen/components/SocialNetworks';
import Pagination from './mock/Pagination.svg';

const ResearchReportsScreen = () => {
  return (
    <>
      <Container>
        <h3 className=' pt-4 mb-12 text-[31px] font-bold'>Research Reports</h3>
        <div className='flex flex-col gap-6 relative'>
          <Image src='/mock/Пост 4.svg' width={1260} height={309} alt='post' />
          <Image src='/mock/Пост 3.svg' width={1260} height={309} alt='post' />
          <Image src='/mock/Пост 4.svg' width={1260} height={309} alt='post' />
          <Image src='/mock/Пост 5.svg' width={1260} height={309} alt='post' />
          <Image src='/mock/Пост 6.svg' width={1260} height={309} alt='post' />
          <Image src='/mock/Пост 7.svg' width={1260} height={309} alt='post' />
          <Image src='/mock/Пост 8.svg' width={1260} height={309} alt='post' />
          <Image src='/mock/Пост 9.svg' width={1260} height={309} alt='post' />

          <div className='absolute w-full h-full top-0'></div>
        </div>
        <Pagination className='mt-12 mx-auto' />
      </Container>

      <section className='my-[88px]'>
        <SocialNetworks />
      </section>
    </>
  );
};

export default ResearchReportsScreen;
