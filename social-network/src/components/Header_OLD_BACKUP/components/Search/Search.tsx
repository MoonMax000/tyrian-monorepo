'use client';
import IconSearch from '@/assets/icons/search.svg';
import { cn } from '@/utilts/cn';

import { FC, KeyboardEventHandler, useState } from 'react';

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
  placeholder = 'Search',
  value,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2 py-3 px-[18px] custom-bg-blur rounded-lg border-[1px] ',
        className,
        !isFocused && 'border-regaliaPurple',
        isFocused && 'border-purple',
      )}
    >
      <IconSearch
        onClick={handleBlur}
        width={19}
        height={19}
        className={cn(
          'cursor-pointer',
          !isFocused && 'text-lighterAluminum',
          isFocused && 'text-foreground',
        )}
      />

      <input
        onKeyDown={(event) => onKeyDown?.(event)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        type='text'
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          'w-full outline-none bg-transparent text-foreground h-[20px] ',
          !isFocused && 'placeholder:text-lighterAluminum',
          isFocused && 'placeholder:text-foreground',
        )}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Search;
