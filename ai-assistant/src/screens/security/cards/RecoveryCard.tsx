'use client';
import { FC, ReactNode, useState } from 'react';
import Paper from '@/components/ui/Paper/Paper';
import Button from '@/components/ui/Button/Button';
import ModalWrapper from '@/components/ModalWrapper';
import { RecoveryEmail } from '@/components/modals/RecoveryMail/RecoveyEmail';
import { RecoveryPhone } from '@/components/modals/RecoveryPhone/RecoveyPhone';
import { useQuery } from '@tanstack/react-query';
import { AuthService } from '@/services/AuthService';

type TModalsType = 'email' | 'phone';
interface RecoveryItem {
  modal: TModalsType;
  label: string;
  value: string | null;
  description: string;
}

export const RecoveryCard: FC = () => {
  const [modal, setModal] = useState<TModalsType | null>(null);

  const { data: profile } = useQuery({
    queryKey: ['getProfile'],
    queryFn: () => AuthService.getProfile(),
  });

  const handleOpen = (modal: TModalsType) => {
    setModal(modal);
  };

  const handleClose = () => {
    setModal(null);
  };

  const recoveryItems: RecoveryItem[] = [
    {
      modal: 'email',
      label: 'Recovery email address',
      value: profile?.backup_email ?? '',
      description: 'Setup Recovery email to secure your account',
    },
    {
      modal: 'phone',
      label: 'Recovery phone number',
      value: profile?.backup_phone ?? '',
      description: 'Add phone number to setup SMS Recovery for your account',
    },
  ];

  const Modals: Record<TModalsType, ReactNode> = {
    email: <RecoveryEmail onClose={handleClose} />,
    phone: <RecoveryPhone onClose={handleClose} />,
  };
  return (
    <Paper className='p-4'>
      <h2 className='text-2xl font-bold pb-4 border-b border-b-regaliaPurple'>
        Recovery
      </h2>
      <div className='pt-4 flex flex-col gap-4'>
        {recoveryItems.map(({ label, value, description, modal }) => (
          <div key={label} className='flex justify-between items-center'>
            <div className='flex flex-col text-[15px] font-bold'>
              <p>
                {label}:{' '}
                <span className='text-primaryPurple font-bold'>
                  {value ?? 'None'}
                </span>
              </p>
              <p className='font-medium text-lighterAluminum'>{description}</p>
            </div>
            <Button
              className='min-w-[180px]'
              variant='primary'
              onClick={() => handleOpen(modal)}
            >
              Setup
            </Button>
          </div>
        ))}
      </div>
      {modal && (
        <ModalWrapper onClose={handleClose}>{Modals[modal]}</ModalWrapper>
      )}
    </Paper>
  );
};
