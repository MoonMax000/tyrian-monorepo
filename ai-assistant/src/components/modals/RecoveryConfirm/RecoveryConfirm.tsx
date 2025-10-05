import Button from '@/components/ui/Button/Button';
import Paper from '@/components/ui/Paper/Paper';
import { AuthService } from '@/services/AuthService';
import { useMutation } from '@tanstack/react-query';
import React, { FC } from 'react';

interface Props {
  onSubmit: () => void;
  onClose: () => void;
}

export const RecoveryConfirm: FC<Props> = ({ onSubmit, onClose }) => {
  const { mutateAsync: logoutFunc } = useMutation({
    mutationKey: ['logout'],
    mutationFn: () => AuthService.logout(),
  });

  const handleLogout = () => {
    window.location.reload();
    logoutFunc();
    onClose();
  };

  return (
    <Paper className='w-full bg-inherit rounded-[24px] p-[24px] gap-[10px] flex flex-col border-none'>
      <div className='flex gap-4 w-full justify-between bg-transparent'>
        <Button className='w-[150px]' onClick={onSubmit} variant='primary'>
          Yes
        </Button>
        <Button
          onClick={handleLogout}
          className='w-[150px]'
          variant='secondary'
        >
          No
        </Button>
      </div>
    </Paper>
  );
};
