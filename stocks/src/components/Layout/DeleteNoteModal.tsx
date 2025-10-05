import { FC } from 'react';
import ModalV2 from '../UI/ModalV2';
import Button from '../UI/Button';

interface DeleteNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteNoteModal: FC<DeleteNoteModalProps> = ({ isOpen, onClose }) => {
  return (
    <ModalV2
      isOpen={isOpen}
      onClose={onClose}
      title='Delete Note?'
      contentClassName='py-6 px-4 border-gunpowder border-[1px] w-full max-w-[448px]'
    >
      <div className='my-4 text-webGray'>
        <div className='flex flex-col sm:flex-row items-center justify-center gap-6 mt-10'>
          <Button onClick={onClose} variant='transparent' className='px-[66.5px] py-3'>
            Cancel
          </Button>
          <Button
            onClick={onClose}
            variant='danger'
            className='px-[66.5px] py-3 bg-transparent border-[2px] border-red text-red'
          >
            Delete
          </Button>
        </div>
      </div>
    </ModalV2>
  );
};

export default DeleteNoteModal;
