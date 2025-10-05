'use client';
import { FC, ReactNode, useState } from 'react';
import Paper from '@/components/ui/Paper/Paper';
import Button from '@/components/ui/Button/Button';
import ModalWrapper from '@/components/ModalWrapper';
import { ChangeEmail } from '@/components/modals/ChangeEmail/ChangeEmail';
import { useAppSelector } from '@/store/hooks';
import { AddPhone } from '@/components/modals/AddPhone/AddPhone';
import ChangePassword from '@/components/modals/ChangePassword/ChangePassword';

type TModalsType = 'email' | 'password' | 'phone';

interface AccountSetting {
  modal: TModalsType;
  label: string;
  value: string;
  description: string;
}

export const AccountSettingsCard: FC = () => {
  const [modal, setModal] = useState<TModalsType | null>(null);
  const email = useAppSelector((state) => state.settings.email);

  const accountSettings: AccountSetting[] = [
    {
      modal: 'email',
      label: 'Email',
      value: email,
      description: 'You can update your email address',
    },
    {
      modal: 'password',
      label: 'Password',
      value: 'secure',
      description: 'Change your password to update & protect your account',
    },
    {
      modal: 'phone',
      label: 'Phone number',
      value: '',
      description: 'Add your mobile phone number.',
    },
  ];

  const handleOpen = (modal: TModalsType) => {
    setModal(modal);
  };

  const handleClose = () => {
    setModal(null);
  };

  const Modals: Record<TModalsType, ReactNode> = {
    email: <ChangeEmail onClose={handleClose} />,
    password: <ChangePassword onClose={handleClose} />,
    phone: <AddPhone onClose={handleClose} />,
  };

  return (
    <Paper className='p-4'>
      <h2 className='text-2xl font-bold pb-4 border-b border-b-regaliaPurple'>Account</h2>
      <div className='pt-4 flex flex-col gap-4'>
        {accountSettings.map(({ label, value, description, modal }) => (
          <div key={label} className='flex justify-between items-center'>
            <div className='flex flex-col text-[15px] font-bold'>
              <p>
                {label}
                {value && `: ${value}`}
              </p>
              <p className='font-medium text-lighterAluminum'>{description}</p>
            </div>
            <Button
              className='min-w-[180px]'
              variant={value ? 'primary' : 'secondary'}
              onClick={() => handleOpen(modal)}
            >
              {value ? 'Change' : 'Add'}
            </Button>
          </div>
        ))}
      </div>
      {modal && <ModalWrapper onClose={handleClose}>{Modals[modal]}</ModalWrapper>}
    </Paper>
  );
};
