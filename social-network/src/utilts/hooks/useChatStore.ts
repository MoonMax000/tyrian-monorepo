import {
  Group,
  groups,
  Message,
  messages,
  User,
  UserRelationData,
  userRelationData,
  users,
} from '@/app/data';

import { create } from 'zustand';

export interface State {
  userId: User['id'];
  chatId: User['id'] | Group['id'] | null;
  chatType: 'user' | 'group' | null;
  users: User[];
  groups: Group[];
  messages: Message[];
  userRelationData: UserRelationData[];
  input: string;
  isMobile: boolean;
  isChatShown: boolean;
  hasInitialAIResponse: boolean;
}

export interface Actions {
  setSelectedUser: (userId: User['id']) => void;
  setSelectedGroup: (groupId: Group['id']) => void;
  setInput: (input: string) => void;
  setChatIsShown: (newState: boolean) => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  setMessages: (fn: (messages: Message[]) => Message[]) => void;
  addMessage: (message: Message) => void;
  setHasInitialResponse: (hasInitialResponse: boolean) => void;
  joinGroup: (groupId: Group['id']) => void;
  getCurrentGroup: () => Group | null;
}

const useChatStore = create<State & Actions>()((set, get) => ({
  userId: 6,
  chatId: null,
  chatType: null,
  users: users,
  groups: groups,
  messages: messages,
  userRelationData: userRelationData,
  input: '',
  isMobile: false,
  isChatShown: false,
  hasInitialAIResponse: false,

  setSelectedUser: (userId) =>
    set({ chatId: userId, chatType: 'user', isChatShown: true, input: '' }),
  setSelectedGroup: (groupId) =>
    set({ chatId: groupId, chatType: 'group', isChatShown: true, input: '' }),
  setInput: (input) => set({ input }),
  setChatIsShown: (newState) => set({ isChatShown: newState }),
  handleInputChange: (e) => set({ input: e.target.value }),

  setMessages: (fn) => set((state) => ({ messages: fn(state.messages) })),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setHasInitialResponse: (hasInitialResponse) => set({ hasInitialAIResponse: hasInitialResponse }),

  joinGroup: (groupId) =>
    set((state) => {
      const currentUser = state.users.find((u) => u.id === state.userId);
      const groupIndex = state.groups.findIndex((g) => g.id === groupId);

      if (!currentUser || groupIndex === -1) {
        console.warn(`Cannot join group: User ${state.userId} or Group ${groupId} not found.`);
        return {};
      }

      const groupToJoin = state.groups[groupIndex];

      if (groupToJoin.users.includes(state.userId)) {
        console.log(`User ${state.userId} is already in group ${groupId}.`);
        if (state.chatId !== groupId || state.chatType !== 'group') {
          return { chatId: groupId, chatType: 'group', isChatShown: true, input: '' };
        }
        return {};
      }

      const updatedGroup = {
        ...groupToJoin,
        users: [...groupToJoin.users, state.userId],
      };

      const updatedGroups = [...state.groups];
      updatedGroups[groupIndex] = updatedGroup;

      console.log(`User ${state.userId} joined group ${groupId}. Switching chat.`);

      return {
        groups: updatedGroups,
        chatId: groupId,
        chatType: 'group',
        isChatShown: true,
        input: '',
      };
    }),
  getCurrentGroup: () => {
    const { chatType, chatId, groups } = get();
    if (chatType === 'group' && chatId !== null) {
      return groups.find((g) => g.id === chatId) ?? null;
    }
    return null;
  },
}));

export default useChatStore;
