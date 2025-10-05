'use client';

import { FC, ReactNode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Xmark from '@/assets/icons/xmark.svg';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

interface ModalWrapperProps {
  onClose?: () => void;
  isOpen: boolean;
  title?: string;
  children: ReactNode;
  withCloseButton?: boolean;
  className?: string;
  contentClassName?: string;
}

const ModalWrapper: FC<ModalWrapperProps> = ({
  children,
  onClose,
  title,
  isOpen,
  withCloseButton = false,
  className,
  contentClassName,
}) => {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalRoot(document.getElementById('portal-root'));
  }, []);

  useEffect(() => {
    const escFunction = (event: KeyboardEvent) => {
      if ((event.key === 'Esc' || event.key === 'Escape') && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, []);

  if (!portalRoot) {
    return null;
  }

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={clsx(
            'fixed w-full backdrop-blur-md h-full flex justify-center items-center z-[101] top-0 left-0',
            className,
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.currentTarget === e.target && onClose) {
              onClose();
            }
          }}
        >
          <div className={clsx('bg-background rounded-[24px]', contentClassName)}>
            <div className='flex items-center justify-between gap-y-4 px-4'>
              <h2 className='text-[24px] font-bold text-white'>{title}</h2>
              {withCloseButton && (
                <button className='text-grayLight hover:text-white ml-auto' onClick={onClose}>
                  <Xmark width={16} height={16} />
                </button>
              )}
            </div>
            <div
              className={clsx({
                'mt-4': withCloseButton,
              })}
            >
              {children}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalRoot,
  );
};

export default ModalWrapper;
