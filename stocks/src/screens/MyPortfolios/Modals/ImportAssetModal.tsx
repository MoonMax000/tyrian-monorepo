import { FC } from 'react';

import Import from '@/assets/addActiveMocks/import.svg';
import Button from '@/components/UI/Button';

const ImportAssetModal: FC = () => {
  return (
    <div className='flex flex-col items-center'>
      <Import className='w-full' />
      <div className='flex gap-2.5 mt-6 w-full'>
        <Button variant='transparent' className='w-full'>
          Cancel
        </Button>
        <Button className='w-full'>Upload</Button>
      </div>
    </div>
  );
};

export default ImportAssetModal;
