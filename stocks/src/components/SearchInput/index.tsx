'use client';
import { useState } from 'react';
import Input from '../UI/Input';
import IconSearch from '@/assets/icons/search.svg';

interface SearchInputProps {
  className?: string;
  placeholder?: string;
  inputWrapperClassName?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  className,
  placeholder = 'Search',
  inputWrapperClassName='!px-6 !py-3 h-full'
}) => {
  const [value, setValue] = useState<string>('');

  return (
    <Input
      wrapperClassName={`w-[300px] h-11 ${className || ''}`}
      className='placeholder:opacity-[48%]'
      inputWrapperClassName={inputWrapperClassName}
      icon={<IconSearch className='opacity-[48%] mr-2' />}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      iconPosition='left'
    />
  );
};

export default SearchInput;
