import { FC, useState } from 'react';
import Paper from '@/components/ui/Paper/Paper';
import Button from '@/components/ui/Button/Button';
import { Toggle } from '@/components/ui/Toogle/Toogle';
import ModalWrapper from '@/components/ModalWrapper';
import TwoFactorModalCard from '@/components/modals/TwoFactorAuth/TwoFactorModalCard';

interface Props {
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
}

export const TwoFactorCard: FC<Props> = ({ isEnabled, onToggle }) => {
  const [modal, setModal] = useState<string | null>(null);

  const handleOpen = (modal: string) => {
    setModal(modal);
  };

  const handleClose = () => {
    setModal(null);
  };

  return (
    <Paper className='p-4'>
      <h2 className='text-2xl font-bold pb-4 border-b border-b-regaliaPurple'>
        Two-Factor Authentication
      </h2>
      <div className='pt-4 flex flex-col gap-4'>
        <div className='flex justify-between items-center'>
          <div className='flex flex-col text-[15px] font-bold'>
            <p>Enable Authentication</p>
            <p className='font-medium text-lighterAluminum'>
              Enable Two-Factor Authentication to enhance the security
            </p>
          </div>
          <Toggle state={isEnabled} onChange={onToggle} />
        </div>

        <div className='flex justify-between items-center'>
          <div className='flex flex-col text-[15px] font-bold'>
            <p>Current Method: Email</p>
            <p className='font-medium text-lighterAluminum'>
              Enable Two-Factor Authentication to enhance the security
            </p>
          </div>
          <Button className='min-w-[180px]' variant='primary' onClick={() => handleOpen('twoFactor')}>
            Edit
          </Button>
          {modal === 'twoFactor' && (
            <ModalWrapper onClose={handleClose}>
              <TwoFactorModalCard onClose={handleClose} />
            </ModalWrapper>
          )}
        </div>
      </div>
    </Paper>
  )
};
