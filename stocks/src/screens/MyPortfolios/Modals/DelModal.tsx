import Button from '@/components/UI/Button';

import { FC } from 'react';

const DelModal: FC = () => {
  return (
    <div>
      <div className='max-w-[422px] m-auto  mb-6 '>
        <p className='text-body-15 opacity-[64%]'>
          Вместе с портфелем будут удалены все вложенные в него активы. Вы уверены, что хотите
          удалить портфель?
        </p>
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

export default DelModal;
