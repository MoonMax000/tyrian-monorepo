import React from 'react';

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export interface TabsListProps {
  children: React.ReactNode;
  withUnderLine?: boolean;
  className?: string;
}

export interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'outlined';
}

export interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export interface TabsContextType {
  activeTab: string | undefined;
  setActiveTab: (value: string) => void;
}
