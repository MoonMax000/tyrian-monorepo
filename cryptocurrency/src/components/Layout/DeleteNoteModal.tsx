import { FC } from 'react';
import ModalWrapper from '../UI/Modal';

interface DeleteNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteNoteModal: FC<DeleteNoteModalProps> = ({ isOpen, onClose }) => {
  
  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title='Удалить заметку?'
      titleClassName='text-white text-center'
      className='py-6'
    >
      <div className='space-y-4 text-[#FFFFFF7A]'>
        <div className='flex justify-center gap-4'>
        <button className='text-white w-[180px] h-[40px] rounded-[8px] hover:opacity-50 cursor-pointer border-2 border-[#FFFFFF14]'>
            Отмена
          </button>
          <button className='text-white w-[180px] h-[40px] rounded-[8px] hover:opacity-50 cursor-pointer bg-[#A06AFF]'>
            Удалить
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default DeleteNoteModal;
