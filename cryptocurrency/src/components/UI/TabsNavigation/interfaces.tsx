import { ReactNode } from 'react';

export interface Tab {
  label: string;
  content: ReactNode;
  tab: string;
}

export interface TabsNavigationProps {
  tabs: Tab[];
  className?: string;
  offsetLeft?: string;
}
