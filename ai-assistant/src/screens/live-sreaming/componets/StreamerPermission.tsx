'use client';
import ModalWrapper from '@/components/ModalWrapper';
import Button from '@/components/ui/Button/Button';
import Paper from '@/components/ui/Paper/Paper';
import { FC, useEffect, useState } from 'react';
import BecomeStreamer from './BecomeStreamer';
import { TStreamerRequesStatus, UserService } from '@/services/UserService';
import { useQuery } from '@tanstack/react-query';

export const StreamerPermission: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<TStreamerRequesStatus | null>(null);

  const { data } = useQuery({
    queryKey: ['getStreamerRequesStatus'],
    queryFn: () => UserService.getStreamerRequesStatus(),
  });

  useEffect(() => {
    if (data?.data.status) {
      setStatus(data.data.status);
    }
  }, [data?.data.status]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const getButton = () => {
    if (!status) {
      return (
        <Button
          variant='gray'
          onClick={handleOpenModal}
          className='py-3 w-[180px]'
        >
          Submit Request
        </Button>
      );
    }

    if (status === 'created') {
      return (
        <Button variant='orange' className='py-3 w-[180px]'>
          Pending
        </Button>
      );
    }

    if (status === 'approved') {
      return (
        <Button variant='green' className='py-3 w-[180px]'>
          Permission Granted
        </Button>
      );
    }

    if (status === 'rejected') {
      return (
        <Button
          variant='red'
          onClick={handleOpenModal}
          className='py-3 w-[180px]'
        >
          Resticted
        </Button>
      );
    }
  };

  return (
    <Paper className='flex justify-between items-center p-4'>
      <div className='flex flex-col'>
        <h2 className='text-2xl font-semibold'>Streamer’s Permission</h2>
        <span className='text-[15px] font-medium text-lighterAluminum'>
          {status
            ? `Current status: ${status}`
            : 'You haven’t submitted a permission request yet.'}
        </span>
      </div>

      {getButton()}

      {isModalOpen && (
        <ModalWrapper onClose={() => setIsModalOpen(false)}>
          <BecomeStreamer
            onClose={() => {
              setIsModalOpen(false);
              setStatus('created');
            }}
          />
        </ModalWrapper>
      )}
    </Paper>
  );
};
