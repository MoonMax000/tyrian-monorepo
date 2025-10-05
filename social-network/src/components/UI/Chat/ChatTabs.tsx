'use client';

import { cn } from '@/utilts/cn';
import { Badge } from '@/components/shadcnui/badge';
import { FC } from 'react';

export type TabType = 'all' | 'archive' | 'for-you';

interface ChatTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  className?: string;
}

const ChatTabs: FC<ChatTabsProps> = ({ activeTab, onTabChange, className }) => {
  const tabs: { id: TabType; label: string; count?: string }[] = [
    { id: 'all', label: 'All', count: '' },
    { id: 'archive', label: 'Archive' },
    { id: 'for-you', label: 'For you' },
  ];

  return (
    <div className={cn('w-full border-b border-onyxGrey', className)}>
      <div className='flex gap-6 px-6'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'p-1.5 text-xs text-white font-bold border-b-4 border-transparent transition-all duration-300',
              activeTab === tab.id
                ? 'border-b-4 border-primary'
                : 'hover:border-b-4 hover:border-onyxGrey',
            )}
          >
            {tab.label}
            {tab.count && (
              <Badge className='ml-2 bg-onyxGrey hover:bg-onyxGrey text-xs text-white font-bold border-none'>
                {tab.count}
              </Badge>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatTabs;
