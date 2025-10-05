import { FC } from 'react';
import PercentLabel from '../UI/percentLabel';
import Button from '../UI/Button';

const ShortReview: FC = () => {
  return (
    <>
      <h4 className='text-h4 mb-6'>Краткий обзор</h4>
      <div className='flex max-w-[361px] justify-between mb-12'>
        <div className='flex flex-col'>
          <h3 className='tracking-[-2]  opacity-48 text-body-12 mb-4 uppercase'>Общий баланс</h3>
          <p className='text-h4 tracking-[-2]'>$1 250 000</p>
          <div className='flex gap-[9px] items-center'>
            <p className='text-green text-body-15'>+ $250 000</p>
            <PercentLabel value={20} symbolAfter={'%'} showSymbolBefore={false} />
          </div>
        </div>
        <div className='flex flex-col'>
          <h3 className='tracking-[-2]  opacity-48 text-body-12 mb-4 uppercase'>
            Список портфелей
          </h3>
          <p className='text-body-15  tracking-[-2]'>Общий портфель</p>
          <p className='text-body-15   tracking-[-2]'>Портфель №1</p>
        </div>
      </div>
      <div className='max-w-[403px]'>
        <h3 className='tracking-[-2]  opacity-48 text-body-12 mb-4 uppercase'>
          Структура портфеля
        </h3>
        <div className='grid grid-cols-2 gap-x-6 gap-y-4'>
          <div className='flex items-center justify-between'>
            <span className='text-body-15'>Акции</span>
            <div className='flex items-center gap-2'>
              <span className='opacity-48'>60%</span>
              <div className='w-[81px] rounded-[4px] bg-gradient-to-r from-[rgba(96,64,153,0)] to-purple h-[20px]' />
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-body-15'>Облигации</span>
            <div className='flex items-center gap-2'>
              <span className='opacity-48'>30%</span>
              <div className='w-[40px] rounded-[4px] bg-gradient-to-r from-[rgba(96,64,153,0)] to-blue h-[20px]' />
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-body-15'>Наличные</span>
            <div className='flex items-center gap-2'>
              <span className='opacity-48'>10%</span>
              <div className='w-[13px] rounded-[4px] bg-gradient-to-r from-[rgba(96,64,153,0)] to-[#FFB46A] h-[20px]' />
            </div>
          </div>
        </div>
      </div>
      <Button className='w-full h-[40px] rounded-[8px] hover:opacity-50 cursor-pointer bg-purple mt-[88px]'>
        Добавить актив
      </Button>
    </>
  );
};

export default ShortReview;
