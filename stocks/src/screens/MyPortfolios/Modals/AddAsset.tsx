import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import Select from '@/components/UI/Select';

import { FC } from 'react';

const AddAsset: FC = () => {
  return (
    <div className='max-w-[342px] m-auto '>
      <Select
        variant='gray'
        label=' Выберите акцию'
        wrapperClassName=' mb-4  text-[#FFFFFF7A]'
        selectIconClasses='!text-white opacity-[48%] '
        fieldClassname='h-10'
        labelClassname='mb-[6px] opacity-[48%]'
      />
      <div className='flex gap-6 items-center justify-between mb-4'>
        <Input label='Стоимость' className='text-[#FFFFFF7A]' />
        <Input label='Количество' className='text-[#FFFFFF7A]' />
      </div>
      <Select
        variant='gray'
        label=' Выберите портфель'
        wrapperClassName=' mb-4  text-[#FFFFFF7A]'
        selectIconClasses='!text-white opacity-[48%] '
        fieldClassname='h-10'
        labelClassname='mb-[6px] opacity-[48%]'
        placeholder='Общий портфель'
      />
      <Button className='max-w-[180px] w-full h-[40px] rounded-[8px] hover:opacity-50 cursor-pointer bg-purple mt-12 m-auto'>
        Добавить
      </Button>
    </div>
  );
};

export default AddAsset;
