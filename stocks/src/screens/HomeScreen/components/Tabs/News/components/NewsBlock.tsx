'use client';
import { PercentCard } from '@/components/PercentCard/PercentCard';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export const NewsBlock = () => {
  const { push } = useRouter();
  return (
    <div className='flex gap-4 rounded-3xl border border-regaliaPurple p-4 backdrop-blur-[100px]'>
      <div className='flex flex-col gap-4'>
        <p className='text-[24px] font-bold cursor-pointer' onClick={() => push(`/news/${1}`)}>
          The Ministry of Justice has registered an order to establish a standard for sales of
          petrochemicals on the stock exchange
        </p>
        <p className='text-[15px] font-medium'>
          Goldman Sachs earnings beat Q1 views as global banking revenue offset declines elsewhere.
          The Dow giant was cautious on Q2. But GS stock rose.
        </p>
        <span className='text-[12px] font-bold text-[#B0B0B0]'>
          Business DailY • Dec 26, 2024, 22:40
        </span>
        <div className='flex gap-2'>
          <PercentCard
            withLeftContent
            className='w-fit gap-2'
            leftContent='Apple'
            children={'+0.15%'}
          />
          <PercentCard
            withLeftContent
            className='w-fit gap-2 bg-darkRed'
            leftContent='AMAZON'
            children={'-0.15%'}
            classNameText='text-red'
          />
        </div>
      </div>
      <Image src='/dollar.png' alt='sadaa' width={280} height={190} />
    </div>
  );
};
