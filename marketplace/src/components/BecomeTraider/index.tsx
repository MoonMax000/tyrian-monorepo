import { FC } from 'react';
import Button from '../UI/Button/Button';
import Image from 'next/image';

const BecomeTraider: FC = () => {
  return (
    <section className='w-full py-[53px] mt-[80px] flex flex-col items-center justify-center bg-gradient-to-r from-blackedGray via-gunpowder to-blackedGray'>
      <h2 className='text-[40px] font-bold'>Войти в высшую лигу</h2>
      <p className='opacity-45 text-[15px]'>
        Получайте доход за копирование ваших сделок на нашей платформе!
      </p>
      <Button className='w-[180px] mt-6'>
        <div className='flex items-center justify-center'>
          Стать трейдером <Image src='/icons/arrow-white.svg' width={24} height={24} alt='arrow' />
        </div>
      </Button>
    </section>
  );
};

export default BecomeTraider;
