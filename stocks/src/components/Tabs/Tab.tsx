import clsx from 'clsx';
import { FC } from 'react';

export interface TabModel {
  name: string;
  key: string;
}

interface TabProps {
  tab: TabModel;
  onClick?: (tab: TabModel) => void;
  isActive?: boolean;
  tabClassName?: string;
  lineClassName?: string;
}

const Tab: FC<TabProps> = ({ tab, isActive, onClick, tabClassName, lineClassName }) => {
  return (
    <div
      role='button'
      data-active={isActive}
      className={clsx('text-body-15 pb-[9px] transition-all relative', tabClassName, {
        'opacity-40': !isActive,
        'text-purple': isActive,
        'hover:opacity-100': !isActive,
        'border-b': isActive,
        'border-purple': isActive,
        'border-b-[4px]': isActive,
      })}
      onClick={() => {
        onClick?.(tab);
      }}
    >
      {tab.name}
    </div>
  );
};

export default Tab;
