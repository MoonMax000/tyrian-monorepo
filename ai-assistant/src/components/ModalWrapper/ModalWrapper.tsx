'use client';

import { useClickOutside } from '@/hooks/useClickOutside';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

interface ModalWrapperProps {
  children: ReactNode;
  onClose: () => void;
  className?: string;
}

const ModalWrapper: FC<ModalWrapperProps> = ({ children, onClose }) => {
  const [isMounted, setIsMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // useClickOutside(modalRef, onClose);

  useEffect(() => {
    setIsMounted(true);

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
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
    <div className='fixed inset-0 z-[999] flex items-center justify-center bg-[#00000099]'>
      <div ref={modalRef}>{children}</div>
    </div>,
    document.getElementById('portal-root')!,
  );
};

export default ModalWrapper;
