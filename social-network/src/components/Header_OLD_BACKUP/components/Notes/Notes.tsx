'use client';

import { useState } from 'react';
import IconNotes from '@/assets/icons/header/icon-notes.svg';

const Notes = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
    console.log(isOpen);
  };

  return (
    <div className='relative border border-white border-opacity-20 rounded-full p-2 min-w-[44px] min-h-[44px] h-[44px]'>
      {/* <span
        className='flex justify-center items-center absolute bg-red w-fit size-5 rounded-full 
        leading-[15px] min-w-5 h-[18px] -top-[7px] -right-[6px] text-white text-xs text-center self-center'
      >
        4
      </span> */}

      <button onClick={() => handleClick()}>
        <IconNotes />
      </button>
    </div>
  );
};

export default Notes;
