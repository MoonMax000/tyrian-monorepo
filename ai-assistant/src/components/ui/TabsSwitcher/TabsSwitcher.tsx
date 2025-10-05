import React, { ReactNode, useState } from 'react';
import Button from '../Button/Button';
import { cn } from '@/utilts/cn';

interface TabsProps<T> {
  tabs: T[];
  onChange: (tab: T) => void;
  defaultIndex?: number;
  className?: string;
  icons?: ReactNode[];
}

const Tabs = <T extends string>({
  tabs,
  onChange,
  defaultIndex,
  className,
  icons,
}: TabsProps<T>) => {
  const [activeTab, setActiveTab] = useState<T>(tabs[defaultIndex || 0]);

  const handleTabClick = (tab: T) => {
    setActiveTab(tab);
    onChange(tab);
  };

  return (
    <div className='flex flex-start gap-[12px]'>
      {tabs.map((tab, index) => (
        <Button
          key={tab}
          onClick={() => handleTabClick(tab)}
          ghost={activeTab !== tab}
          className={cn(className, {
            'border border-[#181B22] ': activeTab !== tab,
            'text-[#fff]': activeTab === tab,
            'bg-gradient-to-r from-darkPurple to-lightPurple border-darkPurple':
              activeTab === tab,
          })}
        >
          <div className='flex gap-2'>
            {icons?.[index]}
            {tab}
          </div>
        </Button>
      ))}
    </div>
  );
};

export default Tabs;
