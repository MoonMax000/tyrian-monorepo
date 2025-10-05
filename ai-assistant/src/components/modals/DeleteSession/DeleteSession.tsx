import Button from '@/components/ui/Button/Button';
import Paper from '@/components/ui/Paper/Paper';
import React, { FC } from 'react';

interface Props {
  onSubmit: () => void;
  onClose: () => void;
}

export const DeleteSession: FC<Props> = ({ onSubmit, onClose }) => {
  return (
    <Paper className='w-full bg-inherit rounded-[24px] p-[24px] gap-[10px] flex flex-col border-none'>
      <p className='text-lg font-semibold mb-4'>
        Are you sure you want to close this session?
      </p>
      <div className='flex gap-4 w-full justify-between bg-transparent'>
        <Button className='w-[150px]' onClick={onSubmit} variant='primary'>
          Yes
        </Button>
        <Button onClick={onClose} className='w-[150px]' variant='secondary'>
          No
        </Button>
      </div>
    </Paper>
  );
};
