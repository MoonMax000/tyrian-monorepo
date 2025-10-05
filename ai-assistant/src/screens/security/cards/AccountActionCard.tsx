import { FC, useState } from 'react';
import Paper from '@/components/ui/Paper/Paper';
import Button from '@/components/ui/Button/Button';
import ModalWrapper from '@/components/ModalWrapper';
import DeactivateAccountCard from '@/components/modals/DeactivateAccount/DeactivateAccountCard';
import DeleteAccountCard from '@/components/modals/DeleteAccount/DeleteAccountCard';

export interface AccountAction {
  key: 'deactivate' | 'delete';
  title: string;
  description: string;
  isActive: boolean;
}

interface Props {
  items: AccountAction[];
}

export const AccountActionCard: FC<Props> = ({ items }) => {
  const [modal, setModal] = useState<null | 'deactivate' | 'delete'>(null);

  const handleOpen = (modalKey: 'deactivate' | 'delete') => setModal(modalKey);
  const handleClose = () => setModal(null);

  return (
    <Paper className='p-4'>
      <h2 className='text-2xl font-bold pb-4 border-b border-b-regaliaPurple'>
        Deactivate or Delete Account
      </h2>
      <div className='pt-4 flex flex-col gap-4'>
        {items.map(({ key, title, description, isActive }) => (
          <div key={key} className='flex justify-between items-center'>
            <div className='flex flex-col text-[15px] font-bold'>
              <p>{title}</p>
              <p className='font-medium text-lighterAluminum'>{description}</p>
            </div>
            <Button
              className='min-w-[180px]'
              variant={isActive ? 'primary' : 'danger'}
              ghost={isActive ? false : true}
              onClick={() => handleOpen(key)}
            >
              {title}
            </Button>
            {modal === 'deactivate' && (
              <ModalWrapper onClose={handleClose}>
                <DeactivateAccountCard onClose={handleClose} />
              </ModalWrapper>
            )}
            {modal === 'delete' && (
              <ModalWrapper onClose={handleClose}>
                <DeleteAccountCard onClose={handleClose} />
              </ModalWrapper>
            )}
          </div>
        ))}
      </div>
    </Paper>
  );
};
