'use client';

import ChatBorderRoundedIcon from '@/assets/icons/chat-border-rounded.svg';
import { TChatsModal } from '@/components/chats/StartChatModal';

interface EmptyStateProps {
  handleOpenModal: (type: TChatsModal) => void;
}

export default function EmptyState({ handleOpenModal }: EmptyStateProps) {
  return (
    <div className='flex flex-col items-center justify-center h-full text-center py-16 px-4'>
      <ChatBorderRoundedIcon />
      <h3 className='text-white text-2xl font-bold mt-6 max-w-[510px]'>
        No chats yet,{' '}
        <span
          className='text-primary cursor-pointer hover:underline'
          onClick={() => handleOpenModal('chat')}
        >
          create a new one
        </span>{' '}
        and start communicating with millions of people
      </h3>
    </div>
  );
}