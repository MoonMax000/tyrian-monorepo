import type { ReactNode } from 'react';

export interface IColumn<T extends object> {
  key: keyof T;
  label: string;
  renderColumn?: () => ReactNode;
  renderCell?: (item: T) => ReactNode;
  filter?: boolean;
  filterKey?: string;
  enableSorting?: boolean;
  sortingKey?: string;
  columnClassName?: string;
  rowClassName?: string;
  onHeaderClick?: () => void;
}

export interface SortingState {
  [key: string]: 'asc' | 'desc';
}

export interface FilterState {
  [key: string]: string;
}
