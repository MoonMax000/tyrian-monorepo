'use client';

import { ChatLayout } from '@/components/UI/Chat/ChatLayout/ChatLayout';

const ChatsScreen = () => {
  return (
    <div className='flex flex-col items-center'>
      <ChatLayout navCollapsedSize={8} />
    </div>
  );
};

export default ChatsScreen;
