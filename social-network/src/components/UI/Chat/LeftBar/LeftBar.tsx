'use client';

import { useState } from 'react';
import ChatTabs, { TabType } from '@/components/UI/Chat/ChatTabs';
import { TopBar } from '../Sidebar/TopBar';
import ChatList from '../Sidebar/ChatList';

interface Props {
  isCollapsed: boolean;
}
const LeftBar = ({ isCollapsed }: Props) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  return (
    <div
      data-collapsed={isCollapsed}
      className='relative group flex flex-col h-full bg-onyxGray gap-4 data-[collapsed=true]:py-2'
    >
      <>
        <div className='px-2'>
          <TopBar isCollapsed={true} />
        </div>
        {!isCollapsed && <ChatTabs activeTab={activeTab} onTabChange={setActiveTab} />}
        <div className='overflow-y-auto scrollbar h-full min-h-[680px] max-h-[720px]'>
          <ChatList isCollapsed={isCollapsed} />
        </div>
      </>
    </div>
  );
};

export default LeftBar;
