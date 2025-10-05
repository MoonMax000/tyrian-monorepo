import { MessageWithSender } from '@/components/Chat-refactor/types/chat-types';
import { RootState } from './store';

export const selectChatId = (state: RootState) => state.chat.chatId;
export const selectChatType = (state: RootState) => state.chat.chatType;
export const selectUsers = (state: RootState) => state.chat.users;
export const selectGroups = (state: RootState) => state.chat.groups;
export const selectMessages = (state: RootState) => state.chat.messages;
export const selectInput = (state: RootState) => state.chat.input;
export const selectIsChatShown = (state: RootState) => state.chat.isChatShown;
export const selectHasInitialAIResponse = (state: RootState) => state.chat.hasInitialAIResponse;
export const selectUserId = (state: RootState) => state.chat.userId;

export const selectCurrentGroup = (state: RootState) => {
  if (state.chat.chatType === 'group' && state.chat.chatId !== null) {
    return state.chat.groups.find((g) => g.id === state.chat.chatId) ?? null;
  }
  return null;
};

export const messagesDataSelector = (state: RootState): MessageWithSender[] => {
  const { chatType, chatId, userId, messages, users, userRelationData, groups } = state.chat;

  if (!chatType || chatId === null) return [];

  let messageIds: number[] = [];

  if (chatType === 'user') {
    const relation = userRelationData.find((data) => data.user_id === chatId);
    messageIds = relation?.messages ?? [];
  } else if (chatType === 'group') {
    const group = groups.find((g) => g.id === chatId);
    messageIds = group?.messages ?? [];
  }

  return messageIds
    .map((id) => {
      const message = messages.find((m) => m.id === id);
      const sender = users.find((u) => u.id === message?.user_id);
      if (!message || !sender) return null;
      return {
        message,
        sender,
        messageVariant: sender.id === userId ? 'sent' : 'received',
      };
    })
    .filter(Boolean) as MessageWithSender[];
};
