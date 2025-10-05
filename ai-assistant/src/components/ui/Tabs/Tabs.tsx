'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TabsContextType, TabsProps } from './types';

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}) => {
  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeTab = isControlled ? value : internalValue;

  const setActiveTab = (val: string) => {
    if (!isControlled) {
      setInternalValue(val);
    }
    onValueChange?.(val);
  };

  useEffect(() => {
    if (!isControlled && defaultValue) {
      setInternalValue(defaultValue);
    }
  }, [defaultValue, isControlled]);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

export const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within a Tabs provider');
  }
  return context;
};
