'use client';

import ModalWrapper from '@/components/UI/Modal';
import Button from '@/components/UI/Button';
import { FC } from 'react';
import DeleteSvg from '../img/modals/DeleteModal.svg'; 
import { useRouter } from 'next/navigation';

interface DeletePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeletePortfolioModal: FC<DeletePortfolioModalProps> = ({ isOpen, onClose }) => {
  
  const router = useRouter()

  return (

  <ModalWrapper isOpen={isOpen} onClose={onClose} className='max-w-[470px]'>
    <div className='relative'>
      <DeleteSvg />
      <div className='absolute bottom-4 left-0 w-full flex justify-center gap-6 h-12'>
        <Button
          variant='transparent'
          onClick={() => {
            router.push('/portfolios')
            onClose()
          }}
          className='!bg-[#181A20] !w-[200px] h-10 text-[#EF454A] border-[1px] border-[#EF454Apx]'
        >
          Delete
        </Button>
      </div>
    </div>
  </ModalWrapper>
);
}
export default DeletePortfolioModal;
