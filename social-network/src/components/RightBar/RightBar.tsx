'use client';
import React, { Dispatch, FC, SetStateAction } from 'react';
import SquariesIcon from '@/assets/icons/squaries.svg';
import Button from '@/components/UI/Button/Button';
import { cn } from '@/utilts/cn';

interface Props {
  rightBarOpen: boolean;
  setRightBarOpen: Dispatch<SetStateAction<boolean>>;
}

const RightBar: FC<Props> = ({ rightBarOpen, setRightBarOpen }) => {
  const toogleOpen = () => {
    setRightBarOpen((prev) => !prev);
  };
  return (
    <div className=' min-h-full px-[33px] py-[27px] border-l-2 border-regaliaPurple'>
      <Button
        className={cn('cursor-pointer w-fit', { '!bg-transparent': !rightBarOpen })}
        onClick={toogleOpen}
      >
        <SquariesIcon />
      </Button>
    </div>
  );
};

export default RightBar;
