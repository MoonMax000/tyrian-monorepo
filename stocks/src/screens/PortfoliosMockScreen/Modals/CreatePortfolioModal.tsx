'use client';

import ModalWrapper from '@/components/UI/Modal';
import { FC } from 'react';
import CreatePortfolio from '../img/modals/CreatePortfolio2.svg';
import Button from '@/components/UI/Button';

interface CreatePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePortfolioModal: FC<CreatePortfolioModalProps> = ({ isOpen, onClose }) => (
  <ModalWrapper isOpen={isOpen} onClose={onClose}>
    <div className='relative'>
      <CreatePortfolio />
      <div className='w-full h-20 z-10 bg-[#181A20] absolute bottom-4 flex items-center justify-center gap-6'>
        <Button type='button' variant='transparent' onClick={onClose} className='!w-[180px] h-11'>
          Cancel
        </Button>
        <Button type='button' onClick={onClose} className='!w-[180px] h-11'>
          Create
        </Button>
      </div>
    </div>
  </ModalWrapper>
);


export default CreatePortfolioModal;
