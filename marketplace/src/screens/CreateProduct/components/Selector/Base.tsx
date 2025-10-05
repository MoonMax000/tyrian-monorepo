import { useEffect, useRef, useState } from 'react';
import ArrowIcon from './back-down.svg';

const BaseSelector = ({
  className,
  options,
  defaultValue,
  onSelect,
}: {
  className?: string;
  options: string[];
  defaultValue: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelect?: (selected: any) => void;
}) => {
  const [isMainOpen, setIsMainOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(defaultValue);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMainOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !menuRef.current?.contains(event.target as Node)
      ) {
        setIsMainOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMainOpen]);

  useEffect(() => {
    setSelectedWorkflow(defaultValue);
  }, [defaultValue]);

  const handleSelect = (option: string) => {
    setSelectedWorkflow(option);
    setIsMainOpen(false);
    if (onSelect) {
      onSelect(option);
    }
  };

  const renderDropdown = () => {
    if (!isMainOpen) return null;
    return (
      <div
        ref={menuRef}
        className='absolute z-[9999] rounded-xl border border-regaliaPurple custom-bg-blur overflow-hidden shadow-2xl'
        style={{
          top: `180px`,
          left: `15px`,
          width: `680px`,
        }}
      >
        {options.map((option, index) => (
          <div
            key={index}
            className={`px-4 py-2 text-[15px] custom-bg-blur font-semibold cursor-pointer transition-all border-regaliaPurple duration-200 last:pb-3 first:pt-3 ${
              option === selectedWorkflow
                ? 'bg-lightPurple/30 text-white'
                : 'text-lighterAluminum hover:bg-lightPurple/20 hover:text-white hover:bg-purple hover:py-3'
            }`}
            onClick={() => {
              handleSelect(option);
            }}
          >
            {option}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div
        className={`relative z-10 h-11 rounded-lg border border-regaliaPurple custom-bg-blur cursor-pointer transition-all duration-300 hover:border-lightPurple group ${
          className ?? ''
        }`}
        ref={dropdownRef}
        onClick={() => {
          setIsMainOpen(!isMainOpen);
        }}
      >
        <div className='relative flex flex-col justify-center h-full pl-4 pr-[10px] py-[10px] '>
          <div className='flex items-center justify-between'>
            <span className='text-white text-[15px] leading-[20px] font-semibold'>
              {selectedWorkflow}
            </span>
            <ArrowIcon
              className={`w-6 h-6 text-white transition-transform duration-300 ${
                isMainOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>
      </div>
      {isMainOpen && renderDropdown()}
    </>
  );
};

export default BaseSelector;
