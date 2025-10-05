import { FC } from 'react';
import Paper from '../UI/Paper';
import Image from 'next/image';

const MOC_CARDS = [
  { img: '/icons/trand.svg', title: 'Скриптов в каталоге:', value: '32 000 000 00+' },
  { img: '/icons/folders.svg', title: 'Максимальный ROI:', value: '78 939%' },
  { img: '/icons/canculate.svg', title: 'Реализованный P&L:', value: '415 155 532 344+' },
];

const CategoryCards: FC = () => {
  return (
    <section className='flex gap-4'>
      {MOC_CARDS.map((el, index) => {
        return (
          <Paper key={index} className='px-4 py-5 flex gap-3 min-w-[285px] items-center'>
            <div className='bg-purple bg-opacity-[41%] rounded-full p-3 '>
              <Image src={el.img} alt='icon' width={24} height={24} />
            </div>
            <div>
              <p className='upercase opacity-40 text-body-12'>{el.title}</p>
              <p className='text-xl'>{el.value}</p>
            </div>
          </Paper>
        );
      })}
    </section>
  );
};

export default CategoryCards;
