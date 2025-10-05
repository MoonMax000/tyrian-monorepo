import Image from 'next/image';
import { FC } from 'react';

interface SubCountProps {
  personse: number;
  personseMax?: number;
}

const SubCount: FC<SubCountProps> = ({ personse, personseMax }) => {
  return (
    <div className='inline-flex items-center justify-center bg-gunpowder rounded-[4px] py-[2px] px-[4px]'>
      <Image src='/icons/partners.svg' alt='partners' width={16} height={16} className='mr-2' />
      <p className='text-xs font-medium'>
        {personse.toLocaleString('en-US')}
        {personseMax && <span className='opacity-45'>/{personseMax}</span>}
      </p>
    </div>
  );
};

export default SubCount;
