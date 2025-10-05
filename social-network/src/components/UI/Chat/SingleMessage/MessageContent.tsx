import { motion } from 'framer-motion';
import React, { FC, ReactNode } from 'react';
import { motionTransition, motionVariants } from './helpers';
import { renderActions, renderAvatar, renderMessageContent } from '../СhatUtils';
import { cn } from '@/utilts/cn';
import { MessageData, Message } from '../types';
import { ChatBubble } from '../ChatBubble';

interface Props {
  id: string | number;
  dateSeparatorNode: ReactNode;
  unreadSeparatorNode: ReactNode;
  index: number;
  bubbleVariant: 'received' | 'sent';
  isAINewsChannel: boolean;
  messageVariant: string;
  isCurrentUser: boolean;
  currentChatType: 'user' | 'group';
  sender: MessageData['sender'];
  message: Message;
}

export const MessageContent: FC<Props> = ({
  id,
  dateSeparatorNode,
  unreadSeparatorNode,
  index,
  bubbleVariant,
  isAINewsChannel,
  messageVariant,
  isCurrentUser,
  currentChatType,
  sender,
  message,
}) => {
  return (
    <React.Fragment key={id}>
      {dateSeparatorNode}
      {unreadSeparatorNode}
      <motion.div
        layout
        variants={motionVariants}
        initial='initial'
        animate='animate'
        exit='exit'
        transition={motionTransition(index)}
        style={{ originX: 0.5, originY: 0.5 }}
        className='flex flex-col w-full'
      >
        <ChatBubble
          variant={bubbleVariant}
          className={cn(
            isAINewsChannel ? 'received' : messageVariant,
            isCurrentUser ? 'relative' : '',
          )}
        >
          {renderAvatar({ ...sender, name: sender.name ?? '' }, isCurrentUser, currentChatType)}
          {renderMessageContent(
            { ...message, sender: { ...sender } },
            messageVariant,
            isCurrentUser,
            currentChatType,
          )}
          {renderActions(isCurrentUser, message.forwarding, id?.toString(), messageVariant)}
        </ChatBubble>
      </motion.div>
    </React.Fragment>
  );
};
