import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';

import { FC } from 'react';

const EditModal: FC = () => {
  return (
    <div>
      <div className='max-w-[342px] m-auto  mb-6'>
        <Input label='Введите название портфеля' />
        <Button className='max-w-[180px] w-full h-[40px] rounded-[8px] hover:opacity-50 cursor-pointer bg-purple mt-12 m-auto'>
          Сохраниить
        </Button>
      </div>
      <div className='border-b-2 border-blackedGray'></div>
      <div className='pt-6'>
        <Button variant='danger' className='m-auto'>
          Удалить портфель
        </Button>
      </div>
    </div>
  );
};

export default EditModal;
