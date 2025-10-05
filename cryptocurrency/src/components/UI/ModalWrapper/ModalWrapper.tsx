'use client';

import { FC, ReactNode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface ModalWrapperProps {
  children: ReactNode;
  onClose: () => void;
  className?: string;
  withCloseIcon?: boolean;
  isClosable?: boolean;
}

const ModalWrapper: FC<ModalWrapperProps> = ({
  children,
  onClose,
  className = '',
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
  }, [onClose, isClosable]);

  useEffect(() => {
    if (isMounted && !document.getElementById('portal-root')) {
      const modalDiv = document.createElement('div');
      modalDiv.id = 'portal-root';
      document.body.appendChild(modalDiv);
    }
  }, [isMounted]);

  if (!isMounted) return null;

  const portalRoot = document.getElementById('portal-root');
  if (!portalRoot) return null;

  return ReactDOM.createPortal(
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-[#00000099] backdrop-blur-sm'
      onClick={() => isClosable && onClose()}
    >
      <div className={`relative ${className}`}>
        {withCloseIcon && (
          <button
            className='absolute right-6 top-6 z-[1000] cursor-pointer text-white hover:text-[#A06AFF] transition-colors text-3xl'
            onClick={() => onClose()}
          >
            ×
          </button>
        )}
        <div onClick={(e) => e.stopPropagation()}>{children}</div>
      </div>
    </div>,
    portalRoot,
  );
};

export default ModalWrapper;

