import React, { FC } from 'react';
import { cn } from '@/utils/cn';
import { NavListProps } from './navbarTypes';
import { NavItem } from './NavItem';

export const NavList: FC<NavListProps> = ({ items, depth, active, open, onClick, onToggle }) => (
  <ul
    className={cn(`pl-${depth * 4}`, depth > 1 && 'border-l border-[#523A83] h-full')}
    role={depth > 0 ? 'group' : undefined}
    id={depth > 0 ? `sub-menu-${items[0]?.id}` : undefined}
  >
    {items.map((item) => (
      <NavItem
        key={item.id}
        item={item}
        depth={depth}
        active={active}
        open={open}
        onClick={onClick}
        onToggle={onToggle}
      />
    ))}
  </ul>
);
