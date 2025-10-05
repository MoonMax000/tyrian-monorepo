import { FC, useState } from 'react';
import ModalWrapper from '../UI/Modal';
import Toggle from '../UI/Toggle';
import DeleteNoteModal from './DeleteNoteModal'; // Импортируем модалку для удаления

interface RedactorNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RedactorNoteModal: FC<RedactorNoteModalProps> = ({ isOpen, onClose }) => {
  const [isActiveSubscribe, setIsActiveSubscribe] = useState<boolean>(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false); 

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true); 
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false); 
  };

  return (
    <>
      <ModalWrapper
        isOpen={isOpen}
        onClose={onClose}
        title='Редактировать'
        titleClassName='text-white text-center'
      >
        <div className='space-y-4 text-[#FFFFFF7A]'>
          <div className='flex items-center justify-between'>
            <div className='flex flex-col gap-[6px]'>
              <span>Заголовок</span>
              <input
                type='text'
                placeholder='Введите текст заметки'
                className='w-full border rounded px-3 py-2 focus:outline-none border-2 border-[#FFFFFF14] bg-[#272A32]'
              />
            </div>
            <div className='flex flex-col gap-[6px]'>
              <span>Дата и время</span>
              <div className='flex items-center gap-2'>
                <input
                  type='date'
                  placeholder='ДД/ММ/ГГГГ'
                  className='w-full border rounded px-3 py-2 focus:outline-none border-2 border-[#FFFFFF14] bg-[#272A32]'
                />
                <input
                  type='time'
                  placeholder='00:00'
                  className='w-full border rounded px-3 py-2 focus:outline-none border-2 border-[#FFFFFF14] bg-[#272A32]'
                />
              </div>
            </div>
          </div>
          <input
            type='text'
            placeholder='Введите текст заметки'
            className='w-full h-[196px] border   rounded px-3 py-2 focus:outline-none border-2 border-[#FFFFFF14] bg-[#272A32]'
          />
          <div className='flex justify-between items-center'>
            <span className='text-[#FFFFFF]'>
              Получить уведомление
            </span>
            <Toggle
              isActive={isActiveSubscribe}
              onChange={() => setIsActiveSubscribe((prev) => !prev)}
            />
          </div>
          <div className='flex justify-center gap-4'>
            <button
              onClick={handleDeleteClick} 
              className='text-[#EF454A7A] w-[180px] h-[40px] rounded-[8px] hover:opacity-50 cursor-pointer border-2 border-[#EF454A7A]'
            >
              Удалить
            </button>
            <button className='text-white w-[180px] h-[40px] rounded-[8px] hover:opacity-50 cursor-pointer bg-[#A06AFF]'>
              Сохранить
            </button>
          </div>
        </div>
      </ModalWrapper>

      <DeleteNoteModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
      />
    </>
  );
};

export default RedactorNoteModal;