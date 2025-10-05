import { cn } from '@/utils/cn';
import { FC, ReactNode } from 'react';

interface BlockTabs {
  name: string;
  content: ReactNode;
}

interface BlockTabsProps {
  tabs: BlockTabs[];
  activeTab: number;
  setActiveTab: (index: number) => void;
}

export const BlockTabs: FC<BlockTabsProps> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className='w-fit p-1 bg-blackedGray rounded-[4px]'>
      <div className='flex gap-1'>
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={cn(
              'min-w-[100px] text-center px-3 py-2 font-bold text-[15px] transition-none duration-200 rounded-[4px]',
              {
                'bg-purple text-white': activeTab === index,
                'text-webGray': activeTab !== index,
              },
            )}
            onClick={() => setActiveTab(index)}
          >
            {tab.name}
          </div>
        ))}
      </div>
    </div>
  );
};
