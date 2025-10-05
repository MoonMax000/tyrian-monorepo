import React from 'react';
import Image from 'next/image';
import Arrow from '@/assets/greedometer/Greed-arrow.png';
import RedZone from '@/assets/greedometer/red-zone.png';
import OrangeZone from '@/assets/greedometer/orange-zone.png';
import YellowZone from '@/assets/greedometer/yellow-zone.png';
import GreenZone from '@/assets/greedometer/green-zone.png';
import AcidZone from '@/assets/greedometer/acid-zone.png';

const Greedometer = () => {
  return (
    <div className='relative flex flex-col items-center'>
      <div className='relative flex flex-col items-center w-full h-[75px]  pt-28 mb-20'>
        <Image src={RedZone} alt='RedZone' className='absolute left-2 top-14 -rotate-30' />
        <Image src={OrangeZone} alt='OrangeZone' className='absolute left-6 top-6 -rotate-30' />
        <Image src={YellowZone} alt='YellowZone' className='absolute left-[38%] top-4' />
        <Image src={GreenZone} alt='GreenZone' className='absolute right-6 top-6 -rotate-30' />
        <Image src={AcidZone} alt='AcidZone' className='absolute right-2 top-14 -rotate-30' />
        <Image src={Arrow} alt='Gauge Needle' className='absolute inset-0 left-[36%] top-2' />
        <span className='text-custom mb-1'>50</span>
        <span className='text-custom opacity-50'>Нейтрально</span>
      </div>

      <h4 className='text-smalltable mb-6'>Прошлые значения</h4>
      <div className='flex flex-col items-center gap-4 w-full px-2'>
        <div className='flex items-center justify-between w-full text-[15px] leading-5 font-bold'>
          <p className='text- opacity-50'>Вчера</p>
          <span className='text-titletable inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#8EE071] bg-opacity-50'>
            66
          </span>
        </div>
        <div className='flex items-center justify-between w-full text-[15px] leading-5 font-bold'>
          <p className='text- opacity-50'>Неделю назад</p>
          <span className='text-titletable inline-flex items-center -center w-6 h-6 rounded-full bg-[#FF090A] bg-opacity-50'>
          21
          </span>
        </div><div className='flex items-center justify-between w-full text-[15px] leading-5 font-bold'>
          <p className='text- opacity-50'>Месяц назад</p>
          <span className='text-titletable inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#49FF0A] bg-opacity-50'>
          84
          </span>
        </div>
      </div>
    </div>
  );
};

export default Greedometer;
