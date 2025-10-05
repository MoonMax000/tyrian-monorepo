'use client';

import Container from '@/components/UI/Container';
import React, { FC, useState } from 'react';
import { useRouter } from 'next/navigation';

import Block1 from './img/startblocks/block1.svg';
import Block2 from './img/startblocks/block2.svg';
import Block3 from './img/startblocks/block3.svg';
import PurplePlus from './img/icons/purple-plus.svg';
import CreatePortfolioModal from './Modals/CreatePortfolioModal';
import DropListsBlock from './DropListsBlock';

const MyPortfoliosMockScreen: FC = () => {
  const router = useRouter();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCardClick = (blockName: string) => {
    console.log(`Clicked on ${blockName}`);
    router.push('/my-portfolios');
  };

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  return (
    <Container>
      <div className='flex items-center justify-between'>
        <h3 className='text-h3 my-12'>Portfolios</h3>
        <div onClick={openCreateModal} className='cursor-pointer'>
          <PurplePlus />
        </div>
      </div>

      <section className='mb-20'>
        <div className='relative flex items-center gap-6'>
          <DropListsBlock />
          <div onClick={() => handleCardClick('block1')} className='cursor-pointer'>
            <Block1 />
          </div>
          <div onClick={() => handleCardClick('block2')} className='cursor-pointer'>
            <Block2 />
          </div>
          <div onClick={() => handleCardClick('block3')} className='cursor-pointer'>
            <Block3 />
          </div>
        </div>
      </section>
      <CreatePortfolioModal isOpen={isCreateModalOpen} onClose={closeCreateModal} />
    </Container>
  );
};

export default MyPortfoliosMockScreen;
