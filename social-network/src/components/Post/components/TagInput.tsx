import { Search } from 'lucide-react';
import React, { useState, KeyboardEvent, ChangeEvent, FC } from 'react';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export const TagInput: FC<TagInputProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const tagsLimit = 25;

  const addTag = () => {
    console.log('addTag called with:', inputValue);

    const newTag = inputValue.trim();
    if (
      newTag &&
      newTag.length <= tagsLimit &&
      !value.includes(newTag) &&
      /^[a-zA-Z0-9]+$/.test(newTag) &&
      value.length < tagsLimit
    ) {
      onChange([...value, newTag]);
    }
    setInputValue('');
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className='w-full py-[25px]'>
      <label className='block mb-[24px] text-white text-[19px] font-medium'>Tags</label>
      <div className='w-full flex relative items-center mb-[8px] text-secondary'>
        <Search
          size={16}
          className='opacity-[48%] absolute left-3 flex items-center pointer-events-none'
        />
        <input
          type='text'
          value={inputValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Press Enter after typing to add a tag'
          className='w-full pl-10 px-[14px] py-[12px] bg-blackedGray rounded-[8px] focus:outline-none text-[15px] font-bold placeholder:text-secondary text-secondary'
        />
      </div>
      <div className='flex justify-between mb-[24px]'>
        <p className='text-secondary text-[12px] font-bold'>
          Each tag can be up to 25 characters long and must not contain spaces or special
          characters.
        </p>
        <p className='text-secondary text-[12px] font-bold'>
          {value.length} / {tagsLimit}
        </p>
      </div>
      <div className='flex flex-wrap gap-2 mt-3'>
        {value.map((tag) => (
          <div
            key={tag}
            className='flex items-center bg-regaliaPurple text-white px-2 py-[2px] rounded-[4px] text-[12px] font-bold'
          >
            {tag}
            <button onClick={() => removeTag(tag)} className='ml-2 text-gray-300 hover:text-white'>
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
