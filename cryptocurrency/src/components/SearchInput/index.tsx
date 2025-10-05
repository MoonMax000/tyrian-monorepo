interface SearchInputProps {
  placeholder?: string;
  icon?: React.ReactNode;
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder = 'Search...', icon }) => {
  return (
    <div className='relative flex items-center w-[640px]'>
      {icon && (
        <div className='absolute text-[#808283] left-3 w-6 h-6 flex items-center justify-center opacity-75'>
          {icon}
        </div>
      )}
      <input
        type='text'
        placeholder={placeholder}
        className='w-full rounded-lg bg-[#181A20] px-12 py-2.5 text-[14px] font-medium leading-[19px] placeholder-white placeholder-opacity-50 '
      />
    </div>
  );
};

export default SearchInput;
