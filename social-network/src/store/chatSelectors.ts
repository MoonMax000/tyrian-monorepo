import { ChatState, Message, User } from '@/app/data';

export type MessageWithSender = {
  message: Message;
  sender: User;
  messageVariant: 'sent' | 'received';
};

/**
 * Selector to get messages for the currently active chat (user or group),
 * enriched with sender information and message variant ('sent' or 'received').
 * Returns an empty array if chat is not selected or data is missing.
 *
 * @param state The Zustand chat state.
 * @returns An array of messages with sender info, or an empty array.
 */
export const messagesDataSelector = (state: ChatState): MessageWithSender[] => {
  const { chatType, chatId, userId, messages, users, userRelationData, groups } = state;

  if (!chatType || chatId === null) {
    return []; // No active chat selected
  }

  let messageIds: number[] = [];

  // 1. Find the relevant message IDs based on chat type and ID
  if (chatType === 'user') {
    const relation = userRelationData.find((data) => data.user_id === chatId);
    messageIds = relation?.messages ?? [];
  } else if (chatType === 'group') {
    const group = groups.find((group) => group.id === chatId);
    messageIds = group?.messages ?? [];
  }

  if (messageIds.length === 0) {
    return []; // No messages in this chat
  }

  // 2. Map message IDs to full message objects and enrich with sender data
  const enrichedMessages = messageIds.map((messageId) => {
    const message = messages.find((msg) => msg.id === messageId);
    if (!message) {
      console.warn(`Message with ID ${messageId} not found in state.messages`);
      return null; // Handle missing message
    }

    const sender = users.find((user) => user.id === message.user_id);
    if (!sender) {
      console.warn(`Sender with ID ${message.user_id} not found for message ${messageId}`);
      return null; // Handle missing sender
    }

    const messageVariant = sender.id === userId ? 'sent' : ('received' as const);

    return { message, sender, messageVariant };
  });

  // 3. Filter out any nulls that resulted from missing data and assert type
  return enrichedMessages.filter(Boolean) as MessageWithSender[];
};
