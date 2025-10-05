import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';

import { FC } from 'react';

const AddModal: FC = () => {
  return (
    <div className='max-w-[342px] m-auto'>
      <Input label='Введите название портфеля' />
      <Button className='max-w-[180px] w-full h-[40px] rounded-[8px] hover:opacity-50 cursor-pointer bg-purple mt-12 m-auto'>
        Добавить
      </Button>
    </div>
  );
};

export default AddModal;
