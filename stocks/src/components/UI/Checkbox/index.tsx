import { FC, useState } from 'react';
import CheckIcon from '@/assets/check.svg';

interface Props {
  checked?: boolean;
  handleCheck?: (arg: boolean) => void;
}

export const CheckBox: FC<Props> = ({ checked = false, handleCheck }) => {
  return (
    <label className='relative flex items-center cursor-pointer'>
      <input
        type='checkbox'
        className='absolute opacity-0 w-0 h-0'
        checked={checked}
        onChange={() => handleCheck?.(!checked)}
      />

      <div
        className={`
        w-[18px] h-[18px]
        rounded-[3px]
        relative top-[1px]
        transition-all duration-200
        flex justify-center items-center
        ${checked ? 'bg-[#A06AFF]' : 'bg-[#0C101480] border border-purple'}
      `}
      >
        {checked && <CheckIcon />}
      </div>
    </label>
  );
};
