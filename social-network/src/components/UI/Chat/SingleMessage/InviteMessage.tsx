import { motion } from 'framer-motion';
import React, { FC, ReactNode } from 'react';
import { motionTransition, motionVariants } from './helpers';
import { ChatInviteMessage } from '../ChatInviteMessage';
import { MessageData } from '../types';
import { formatTimestamp } from '@/utilts/date-format';

interface Props {
  id: number | string;
  dateSeparatorNode: ReactNode;
  unreadSeparatorNode: ReactNode;
  index: number;
  inviteDetails: any;
  sender: MessageData['sender'];
  timestamp?: string | number;
}

export const InviteMessage: FC<Props> = ({
  id,
  dateSeparatorNode,
  unreadSeparatorNode,
  index,
  inviteDetails,
  sender,
  timestamp,
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
        className='w-full my-2 px-4'
      >
        <ChatInviteMessage
          inviteDetails={inviteDetails}
          sender={{ ...sender, id: Number(sender.id), name: sender.name || '' }}
          timestamp={formatTimestamp(timestamp)}
        />
      </motion.div>
    </React.Fragment>
  );
};
