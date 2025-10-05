import React from 'react';
import { cn } from '@/utilts/cn';
import StarIcon from '@/assets/system-icons/starIcon.svg';
import Button from '../ui/Button/Button';

type StarButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isFavourite?: boolean;
};

const StarButton: React.FC<StarButtonProps> = ({ className, isFavourite = false }) => {
  return (
    <Button
      className={cn(
        'w-[40px] h-[40px] flex items-center justify-center rounded-[8px] backdrop-blur-[100px] border-regaliaPurple bg-[#0C1014]/50',
        className,
        {
          'bg-gradient-to-r from-darkPurple to-lightPurple border-darkPurple': isFavourite,
          'border border-regaliaPurple': !isFavourite,
        },
      )}
    >
      {isFavourite ? (
        <StarIcon width={20} height={20} />
      ) : (
        <StarIcon width={20} height={20} className='text-lighterAluminum hover:text-white' />
      )}
    </Button>
  );
};

export default StarButton;
