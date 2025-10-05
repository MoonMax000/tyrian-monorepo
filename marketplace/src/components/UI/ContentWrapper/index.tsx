import { FC } from 'react';
import Button from '../Button/Button';
import IconCart from '@/assets/icons/icon-cart.svg';

const ContentWrapper: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className='mx-auto max-w-[1080px] grow'>
      <div className='flex justify-end'>
        <Button className='flex gap-2 w-fit py-0 mt-6 px-6 text-foreground' ghost>
          <IconCart width={16} height={16} />
          Cart
        </Button>
      </div>
      {children}
    </div>
  );
};

export default ContentWrapper;
