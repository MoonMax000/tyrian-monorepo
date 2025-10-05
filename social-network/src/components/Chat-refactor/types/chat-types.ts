import { Message, User } from '@/app/data';

export type MessageWithSender = {
  message: Message;
  sender: User;
  messageVariant: 'sent' | 'received';
};
