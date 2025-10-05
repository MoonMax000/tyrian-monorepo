'use client';

import React, { useEffect, useState } from 'react';
import { ResizablePanel, ResizablePanelGroup } from '@/components/UI/Resizable/Resizable';
import { cn } from '@/utilts/cn';

import { useSelector } from 'react-redux';
import { selectIsChatShown } from '@/store/chatSelectorsMock';
import ChatMain from '../Main';

interface ChatLayoutProps {
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function ChatLayout({ defaultCollapsed = true, navCollapsedSize }: ChatLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isMobile, setIsMobile] = useState(false);

  const isChatShown = useSelector(selectIsChatShown);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenWidth();

    window.addEventListener('resize', checkScreenWidth);
    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

  return (
    <div className={cn('w-full grid', { 'grid-cols-3': isChatShown })}>
      <div className='h-[calc(100vh-136px-24px)] col-span-2'>
        <ResizablePanelGroup
          direction='horizontal'
          onLayout={(sizes: number[]) => {
            document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
          }}
          className={cn('items-stretch bg-[#181a20] rounded-l-lg', {
            'rounded-r-lg': !isChatShown,
          })}
        >
          <ResizablePanel
            defaultSize={navCollapsedSize}
            collapsedSize={navCollapsedSize}
            collapsible={true}
            minSize={24}
            maxSize={24}
            onCollapse={() => setIsCollapsed(true)}
            onExpand={() => setIsCollapsed(false)}
            className={cn(
              isCollapsed && 'min-w-[50px] md:min-w-[80px] transition-all duration-300 ease-in-out',
            )}
          >
            <ChatMain isCollapsed={isCollapsed || isMobile} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
