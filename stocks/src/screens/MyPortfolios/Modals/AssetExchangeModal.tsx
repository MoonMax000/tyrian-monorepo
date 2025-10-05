import { FC } from 'react';

import Exchange from '@/assets/addActiveMocks/assets.svg';
import Button from '@/components/UI/Button';

const AddExchangeModal: FC = () => {
  return (
    <div className='flex flex-col items-center'>
      <Exchange className='w-full' />
      <div className='flex gap-2.5 mt-6 w-full'>
        <Button variant='transparent' className='w-full'>
          Cancel
        </Button>
        <Button className='w-full'>Exchange</Button>
      </div>
    </div>
  );
};

export default AddExchangeModal;
