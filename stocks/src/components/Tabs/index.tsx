import { FC } from 'react';
import Tab, { TabModel } from './Tab';
import clsx from 'clsx';

interface TabsProps {
  tabs: TabModel[];
  activeTabKey: TabModel['key'];
  className?: string;
  onClick?: (tab: TabModel) => void;
  tabClassName?: string;
  lineClassName?: string;
}

const Tabs: FC<TabsProps> = ({ tabs, activeTabKey, className, ...rest }) => {
  return (
    <div
      className={clsx('flex items-center gap-4 pb-4 w-full border-b border-[#FFFFFF1A]', className)}
    >
      {tabs.map((tab) => (
        <Tab key={tab.key} tab={tab} isActive={activeTabKey === tab.key} {...rest} />
      ))}
    </div>
  );
};

export default Tabs;
