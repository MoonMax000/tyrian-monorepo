'use client';

import React, { useState, useRef, useEffect, ReactNode, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utilts/cn';

type TriggerType = 'lmb' | 'rmb' | 'both';

interface ContextMenuProps {
  children: ReactNode;
  menuContent: ReactNode;
  triggerType?: TriggerType;
  className?: string;
  menuClassName?: string;
}

interface ContextMenuContextProps {
  closeMenu: () => void;
}

export const ContextMenuContext = createContext<ContextMenuContextProps>({
  closeMenu: () => {},
});

export const useContextMenu = () => useContext(ContextMenuContext);

export const ContextMenu = ({
  children,
  menuContent,
  triggerType = 'rmb',
  className,
  menuClassName,
}: ContextMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (triggerType === 'rmb' || triggerType === 'both') {
      e.preventDefault();
      const rect = triggerRef.current?.getBoundingClientRect();

      if (rect) {
        setPosition({
          x: e.clientX,
          y: e.clientY,
        });
        setIsOpen(true);
      }
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (triggerType === 'lmb' || triggerType === 'both') {
      e.preventDefault();
      const rect = triggerRef.current?.getBoundingClientRect();

      if (rect) {
        setPosition({
          x: e.clientX,
          y: e.clientY,
        });
        setIsOpen(true);
      }
    }
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(e.target as Node) &&
      triggerRef.current &&
      !triggerRef.current.contains(e.target as Node)
    ) {
      closeMenu();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const adjustPosition = () => {
    if (!menuRef.current) return position;

    const menuRect = menuRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let { x, y } = position;

    if (x + menuRect.width > viewportWidth) {
      x = viewportWidth - menuRect.width - 10;
    }

    if (y + menuRect.height > viewportHeight) {
      y = viewportHeight - menuRect.height - 10;
    }

    return { x, y };
  };

  const { x, y } = adjustPosition();

  return (
    <>
      <div
        ref={triggerRef}
        onContextMenu={handleContextMenu}
        onClick={triggerType === 'lmb' || triggerType === 'both' ? handleClick : undefined}
        className={cn('cursor-context-menu', className)}
      >
        {children}
      </div>

      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <ContextMenuContext.Provider value={{ closeMenu }}>
            <div
              ref={menuRef}
              className={cn(
                'fixed z-[1002] min-w-[100px] bg-[#181A20] shadow-xl shadow-black/50 rounded-lg border border-[#23252D]',
                menuClassName,
              )}
              style={{
                left: `${x}px`,
                top: `${y}px`,
              }}
            >
              {menuContent}
            </div>
          </ContextMenuContext.Provider>,
          document.body,
        )}
    </>
  );
};
