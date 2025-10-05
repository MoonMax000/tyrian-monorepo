import { useState } from 'react';
import IconBtc from '@/assets/icons/icon-btc.svg';
import IconArrowDown from '@/assets/icons/icon-arrow-down.svg';

interface DropdownProps {
  icon?: React.ReactNode;
  text: string;
  arrowIcon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const Dropdown = ({ 
  icon = <IconBtc />, 
  text, 
  arrowIcon = <IconArrowDown />, 
  children,
  className = 'w-[185px]'
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        className="flex items-center gap-2 bg-moonlessNight px-3 py-2 rounded-md w-full hover:bg-opacity-90 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {icon}
        <span className="flex-1 text-left text-white">{text}</span>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          {arrowIcon}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-moonlessNight mt-1 rounded-md shadow-lg z-10 overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;