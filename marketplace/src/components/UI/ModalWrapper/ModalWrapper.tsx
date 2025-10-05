'use client';

import { FC, ReactNode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Paper from '../Paper';

import CrossCircle from '@/assets/icons/modals/cross-circuled.svg';
import Cross from '@/assets/icons/modals/cross.svg';
import { cn } from '@/utils/cn';

type TVaraint = 'primary' | 'secondary';

interface ModalWrapperProps {
  children: ReactNode;
  onClose: () => void;
  className?: string;
  variant?: TVaraint;
  withCloseIcon?: boolean;
  isClosable?: boolean;
}

const ModalWrapper: FC<ModalWrapperProps> = ({
  children,
  onClose,
  className = '',
  variant = 'primary',
  withCloseIcon = true,
  isClosable = true,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isClosable) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    if (isMounted && !document.getElementById('portal-root')) {
      const modalDiv = document.createElement('div');
      modalDiv.id = 'portal-root';
      document.body.appendChild(modalDiv);
    }
  }, [isMounted]);

  if (!isMounted) return null;

  return ReactDOM.createPortal(
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-[#00000099]'
      onClick={() => isClosable && onClose()}
    >
      <Paper
        className={cn('rounded-[24px] relative', className, {
          ['rounded-lg']: variant === 'secondary',
        })}
      >
        {withCloseIcon && (
          <>
            {variant === 'primary' && (
              <CrossCircle
                className={'absolute right-6 top-6 z-[1000] cursor-pointer'}
                onClick={() => onClose()}
              />
            )}
            {variant === 'secondary' && (
              <Cross
                className={'absolute size-[12.75px] right-6 top-[34px] z-[1000] cursor-pointer'}
                onClick={() => onClose()}
              />
            )}
          </>
        )}

        <div onClick={(e) => e.stopPropagation()}>{children}</div>
      </Paper>
    </div>,
    document.getElementById('portal-root')!,
  );
};

export default ModalWrapper;
