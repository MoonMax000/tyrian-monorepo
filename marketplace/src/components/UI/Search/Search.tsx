'use client';

import clsx from 'clsx';
import { FC, KeyboardEventHandler } from 'react';
import Image from 'next/image';

interface IProps {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
}

const Search: FC<IProps> = ({
  className,
  placeholder = 'Поиск',
  value,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
}) => {
  const handleFocus = () => {
    if (onFocus) onFocus();
  };
  const handleBlur = () => {
    if (onBlur) onBlur();
  };
  return (
    <div
      className={clsx(
        'flex items-center gap-2 py-3 px-[14px] border-[1.5px] border-[#FFFFFF29] rounded-lg ',
        className,
      )}
    >
      <div className='cursor-pointer'>
        <Image src={'/icons/search.svg'} onClick={handleBlur} alt='search' width={20} height={20} />
      </div>
      <input
        onKeyDown={(event) => onKeyDown?.(event)}
        onFocus={handleFocus}
        type='text'
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        className='w-full outline-none text-xs text-[#808283] !bg-transparent'
        placeholder={placeholder}
      />
    </div>
  );
};

export default Search;
