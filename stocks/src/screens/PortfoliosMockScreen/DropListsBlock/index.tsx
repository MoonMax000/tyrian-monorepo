'use client';

import { FC, useState } from 'react';
import clsx from 'clsx';

import Dotes          from '../img/icons/dotes-gray.svg';
import Droplist       from '../img/droplist.svg';
import DeletePortfolioModal from '../Modals/DeletePortfolioModal';

const DropListsBlock: FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dots = [0, 1, 2];

  const toggleList = (idx: number) =>
    setOpenIdx((prev) => (prev === idx ? null : idx));

  return (
    <>
      <div className='absolute top-6 right-6 flex gap-[325px]'>
        {dots.map((idx) => (
          <div key={idx} className='relative'>
            <Dotes
              onClick={() => toggleList(idx)}
              className={clsx('cursor-pointer', { 'opacity-60': openIdx !== idx })}
            />

            {openIdx === idx && (
              <div className='absolute top-full right-0 mt-2' onClick={() => setIsModalOpen(true)}>
                <Droplist />
              </div>
            )}
          </div>
        ))}
      </div>

      <DeletePortfolioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default DropListsBlock;
