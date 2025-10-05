import { FC } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { StocksValues } from '@/screens/MainContent/mockData';
import DefaultIcon from '@/assets/defaultIcon.png';
import PercentLabel from '../UI/percentLabel';
import { useRouter } from 'next/navigation';

interface Props {
  item: StocksValues;
  className?: string;
  onClick?: () => void;
}

export const StocksCard: FC<Props> = ({ item, className, onClick }) => {
  // const imageSrc =
  //   item.logo  ? getImageLink(item.logo) : DefaultIcon.src; раскоментить когда убирем все моки

  return (
    <div key={item.title} className={clsx('flex justify-between', className)}>
      <div className='flex gap-2'>
        <Image
          src={item.logo && item.logo.trim() !== '' ? item.logo : DefaultIcon.src}
          alt='company'
          width={0}
          height={0}
          loading='lazy'
          className='rounded-full w-12 h-12'
          unoptimized
          onError={(e) => {
            console.log('Изображение не найдено:', e.currentTarget.src);
            e.currentTarget.src = DefaultIcon.src;
          }}
        />
        <div onClick={onClick} className='flex flex-col gap-1 cursor-pointer'>
          <span>{item.title}</span>
          <span>{item.desc}</span>
        </div>
      </div>

      <div className='flex flex-col items-end'>
        <span>${item.price}</span>

        <PercentLabel value={item.percent} symbolAfter='%' />
      </div>
    </div>
  );
};
