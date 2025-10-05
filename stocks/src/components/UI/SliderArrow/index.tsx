import { FC } from 'react';
import IconChevronLeft from '@/assets/icons/chevron-left.svg';
import IconChevronRight from '@/assets/icons/chevron-right.svg';

interface CustomArrowProps {
  onClick: () => void;
  direction: 'left' | 'right';
}

const CustomArrow: FC<CustomArrowProps> = ({ onClick, direction }) => {
  return (
    <button
      type='button'
      className={`absolute top-[50%] ${direction === 'right' ? '-right-[80px]' : '-left-[80px]'} size-11 rounded-full flex items-center justify-center bg-blackedGray hover:bg-white hover:text-black active:bg-purple transition-colors duration-200`}
      onClick={onClick}
    >
      {direction === 'right' ? <IconChevronRight /> : <IconChevronLeft />}
    </button>
  );
};

export default CustomArrow;