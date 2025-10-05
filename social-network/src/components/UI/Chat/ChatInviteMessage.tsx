import React from 'react';

import { Button } from '@/components/shadcnui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcnui/avatar';

import useChatStore from '@/utilts/hooks/useChatStore';
import { cn } from '@/utilts/cn';
import { Message, User } from '@/app/data';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

interface ChatInviteMessageProps {
  inviteDetails: NonNullable<Message['inviteDetails']>;
  sender?: User;
  timestamp?: string;
}

export const ChatInviteMessage: React.FC<ChatInviteMessageProps> = ({
  inviteDetails,
  sender,
  timestamp,
}) => {
  const inviter = useChatStore((state) =>
    state.users.find((u) => u.id === (inviteDetails.invitedByUserId ?? sender?.id)),
  );
  const group = useAppSelector((state) =>
    state.chat.groups.find((g) => g.id === inviteDetails.groupId),
  );

  const { replace } = useRouter();

  const handleJoinClick = () => {
    if (inviteDetails.groupId) {
      console.log('Attempting to join group:', inviteDetails.groupId);
      replace(`/chats/group/${String(inviteDetails.groupId)}`);
    }
  };

  return (
    <div className='flex flex-col my-3 px-4 w-min'>
      {timestamp && (
        <span className='text-xs text-muted-foreground text-right font-extrabold opacity-75 mb-[6px] text-webGray'>
          {timestamp}
        </span>
      )}
      <div className={cn('flex flex-col py-[10px] px-6 rounded-lg shadow-sm', 'bg-moonlessNight')}>
        <div className='flex gap-2 pb-4 mb-4 border-b border-b-onyxGrey'>
          {group?.avatar && (
            <Avatar className='h-11 w-11'>
              <AvatarImage src={group.avatar} alt={inviteDetails.groupName} />
              <AvatarFallback>{inviteDetails.groupName?.substring(0, 1)}</AvatarFallback>
            </Avatar>
          )}
          <div>
            <p className='text-[15px] text-muted-foreground mb-2 leading-4'>
              {inviteDetails.groupName}
            </p>
            <p className='text-xs text-webGray font-extrabold leading-4'>
              {inviteDetails.groupSlogan}
            </p>
          </div>
        </div>
        <p className='text-[15px] font-bold leading-4 whitespace-nowrap mb-1'>
          You were invited to join {inviteDetails.groupName}
        </p>
        <p className='text-xs font-extrabold text-webGray leading-4 mb-4'>
          Invited by {inviteDetails.invitedByUserName}
        </p>
        <Button className='py-3' size='default' onClick={handleJoinClick}>
          Join Group
        </Button>
      </div>
    </div>
  );
};
