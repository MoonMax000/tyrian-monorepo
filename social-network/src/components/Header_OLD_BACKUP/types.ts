import { ElementType } from 'react';

export interface ILink {
  title: string;
  icon: ElementType;
  link: string;
  isActive?: boolean;
  onClick?: () => void;
}
