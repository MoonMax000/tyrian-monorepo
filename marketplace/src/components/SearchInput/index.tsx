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
  inputWrapperClassName = 'h-full',
}) => {
  const [value, setValue] = useState<string>('');

  return (
    <Input
      containerClassName={` !rounded-lg h-11 ${className || ''}`}
      className='placeholder:text-lighterAluminum'
      inputWrapperClassName={inputWrapperClassName}
      leftIcon={<IconSearch width={19} height={19} className=' mr-2 text-lighterAluminum' />}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default SearchInput;
