'use client';

import { RefObject } from 'react';
import { DropdownMenu, DropdownMenuItem } from '../DropdownMenu';

interface ContextMenuProps {
  menuState: {
    x: number;
    y: number;
    items: DropdownMenuItem[];
    entityId: number | string;
    entityType: 'chat' | 'channel';
  } | null;
  menuRef: RefObject<HTMLDivElement | null>;
  setMenuState: (value: null) => void;
}

export default function ContextMenu({ menuState, menuRef, setMenuState }: ContextMenuProps) {
  if (!menuState) return null;

  return (
    <div
      ref={menuRef}
      className='absolute z-50'
      style={{ top: menuState.y, left: menuState.x }}
      onClick={() => setMenuState(null)}
    >
      <DropdownMenu items={menuState.items} />
    </div>
  );
}
