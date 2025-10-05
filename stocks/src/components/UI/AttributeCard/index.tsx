'use client';
import { useState, type ReactNode, type FC } from 'react';
import clsx from 'clsx';
import ContentWrapper from '../ContentWrapper';
import ChevronDown from '@/assets/icons/chevron-down.svg';

type AttributeItem = {
  title: string;
  value: string;
};

interface IAttributeCardProps {
  title: string;
  className?: string;
  items: AttributeItem[];
  bottomContent?: ReactNode;
  defaultOpen?: boolean;
}

const AttributeCard: FC<IAttributeCardProps> = ({
  title,
  className,
  items,
  bottomContent,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <ContentWrapper className={clsx('flex flex-col gap-y-4', className)}>
      <div className='flex items-center justify-between'>
        <h2 className='text-[24px] font-bold text-white'>{title}</h2>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className='text-grayLight hover:text-white transition-transform'
        >
          <ChevronDown
            className={clsx(
              'transition-transform duration-300',
              isOpen ? 'rotate-180' : 'rotate-0',
            )}
          />
        </button>
      </div>

      {isOpen && items.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4'>
          {items.map(({ title, value }) => (
            <div key={value} className='flex flex-col gap-y-1'>
              <span className='text-grayLight text-[12px] font-bold uppercase'>{title}</span>
              <span className='text-[15px] font-bold text-white'>{value}</span>
            </div>
          ))}
        </div>
      )}

      {isOpen && bottomContent}
    </ContentWrapper>
  );
};

export default AttributeCard;
