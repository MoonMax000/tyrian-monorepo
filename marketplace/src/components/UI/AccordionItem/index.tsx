import ContentWrapper from '../ContentWrapper';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { FC, ReactNode, useState } from 'react';
import Paper from '../Paper';

export interface AccordionItemModel {
  title: string;
  content: ReactNode;
}

interface AccordionItemProps {
  item: AccordionItemModel;
  className?: string;
  contentClassName?: string;
  titleWrapperClassName?: string;
  variant?: 'v1' | 'v2';
}

const AccordionItem: FC<AccordionItemProps> = ({
  item,
  className,
  contentClassName,
  titleWrapperClassName,
  variant = 'v1',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const Wrapper = variant === 'v2' ? ContentWrapper : Paper;

  return (
    <Wrapper
      className={clsx('!p-6', className, {
        '!rounded-lg': variant === 'v1',
      })}
    >
      <div
        className={clsx('flex items-center gap-4 justify-between', titleWrapperClassName)}
        role='button'
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <p className='text-h4'>{item.title}</p>
        <div
          aria-label={isOpen ? 'Закрыть' : 'Открыть'}
          className='group size-6 min-w-6 min-h-6 relative flex flex-col items-center justify-center'
        >
          <span className='block w-full border-[2px] border-white group-hover:border-purple' />
          <span
            className={clsx(
              'block w-full border-[2px] border-white absolute top-[45%] transition-transform group-hover:border-purple',
              {
                'rotate-0': isOpen,
                'rotate-90': !isOpen,
              },
            )}
          />
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, marginTop: 0, opacity: 0 }}
            animate={{ height: 'auto', marginTop: 24, opacity: 100 }}
            exit={{ height: 0, marginTop: 0, opacity: 0 }}
            className={clsx('text-body-15 text-webGray', contentClassName)}
          >
            {item.content}
          </motion.div>
        )}
      </AnimatePresence>
    </Wrapper>
  );
};

export default AccordionItem;
