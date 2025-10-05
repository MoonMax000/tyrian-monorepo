'use client';

import { FC, ReactNode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import IconCrossCirlce from '@/assets/icons/cross-circle.svg';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

interface ModalWrapperProps {
  onClose?: () => void;
  isOpen: boolean;
  title?: string;
  children: ReactNode;
  label?: ReactNode;
  labelValue?: string;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  closeIconClassname?: string;
  withCloseIcon?: boolean;
  isClosable?: boolean;
}

const ModalWrapper: FC<ModalWrapperProps> = ({
  title,
  children,
  onClose,
  label,
  labelValue,
  className,
  titleClassName,
  contentClassName,
  isOpen,
  closeIconClassname,
  withCloseIcon = true,
  isClosable = true,
}) => {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalRoot(document.getElementById('portal-root'));
  }, []);

  useEffect(() => {
    const escFunction = (event: KeyboardEvent) => {
      if ((event.key === 'Esc' || event.key === 'Escape') && isClosable && onClose) {
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
          className='fixed w-full backdrop-blur-md h-full flex justify-center items-center z-[101] top-0'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.currentTarget === e.target && onClose && isClosable) {
              onClose();
            }
          }}
        >
          <div
            className={clsx(
              ' bg-blackedGray w-full max-w-[768px] relative mx-auto rounded-xl flex flex-col max-h-[80%] h-auto',
              className,
            )}
          >
            {onClose && withCloseIcon && (
              <button
                type='button'
                className={clsx(
                  'absolute right-6 top-6 size-6 z-30 opacity-[48%]',
                  closeIconClassname,
                )}
                onClick={onClose}
              >
                <IconCrossCirlce />
              </button>
            )}
            <div>
              {title && <h4 className={clsx('h4 mb-8', titleClassName)}>{title}</h4>}

              {label && <p className='text-body-15 opacity-[48%] whitespace-pre-line'>{label}</p>}
              {labelValue && <p className='text-body-15 whitespace-pre-line'>{labelValue}</p>}
            </div>

            <div className={clsx('max-h-full overflow-auto pr-2 scrollbar', contentClassName)}>
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
