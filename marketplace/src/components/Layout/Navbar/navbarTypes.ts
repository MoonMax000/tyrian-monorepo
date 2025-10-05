import React from 'react';

export type LayoutVariant = 'primal' | 'secondary';

export interface NavItemType {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: NavItemType[];
}

export interface NavItemProps {
  item: NavItemType;
  depth: number;
  active: string | null;
  open: Record<string, boolean>;
  onClick: (id: string, hasChildren: boolean) => void;
  onToggle: (id: string) => void;
}

export interface NavListProps {
  items: NavItemType[];
  depth: number;
  active: string | null;
  open: Record<string, boolean>;
  onClick: (id: string, hasChildren: boolean) => void;
  onToggle: (id: string) => void;
}

export interface NavbarProps {
  variant?: LayoutVariant;
  className?: string;
}