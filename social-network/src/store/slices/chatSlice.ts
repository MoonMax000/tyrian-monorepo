import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { groups, users, messages, userRelationData } from '@/app/data';
import { Message, Group, User, UserRelationData } from '@/app/data';

interface ChatState {
  userId: number | string | null;
  chatId: number | string | null;
  chatType: 'user' | 'group' | null;
  users: User[];
  groups: Group[];
  messages: Message[];
  userRelationData: UserRelationData[];
  input: string;
  isMobile: boolean;
  isChatShown: boolean;
  hasInitialAIResponse: boolean;
  selectedChat: string | number;
}

const initialState: ChatState = {
  userId: 6,
  chatId: null,
  chatType: null,
  users,
  groups,
  messages,
  userRelationData,
  input: '',
  isMobile: false,
  isChatShown: false,
  hasInitialAIResponse: false,
  selectedChat: '',
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSelectedChatId(state, action: PayloadAction<number | string>) {
      state.selectedChat = action.payload;
    },
    setSelectedUser(state, action: PayloadAction<string | number>) {
      state.chatId = action.payload;
      state.chatType = 'user';
      state.isChatShown = true;
      state.input = '';
    },
    setSelectedGroup(state, action: PayloadAction<string | number>) {
      state.chatId = action.payload;
      state.chatType = 'group';
      state.isChatShown = true;
      state.input = '';
    },
    setInput(state, action: PayloadAction<string>) {
      state.input = action.payload;
    },
    setChatIsShown(state, action: PayloadAction<boolean>) {
      state.isChatShown = action.payload;
    },
    handleInputChange(state, action: PayloadAction<string>) {
      state.input = action.payload;
    },
    setMessages(state, action: PayloadAction<(msgs: Message[]) => Message[]>) {
      state.messages = action.payload(state.messages);
    },
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
    setHasInitialResponse(state, action: PayloadAction<boolean>) {
      state.hasInitialAIResponse = action.payload;
    },
    joinGroup(state, action: PayloadAction<number>) {
      const groupId = action.payload;
      const user = state.users.find((u) => u.id === state.userId);
      const groupIndex = state.groups.findIndex((g) => g.id === groupId);
      if (!user || groupIndex === -1) return;

      const group = state.groups[groupIndex];
      if (!group.users.includes(user.id)) {
        group.users.push(user.id);
      }

      state.chatId = groupId;
      state.chatType = 'group';
      state.isChatShown = true;
      state.input = '';
    },
  },
});

export const {
  setSelectedUser,
  setSelectedGroup,
  setInput,
  setChatIsShown,
  handleInputChange,
  setMessages,
  addMessage,
  setHasInitialResponse,
  joinGroup,
  setSelectedChatId,
} = chatSlice.actions;

export default chatSlice.reducer;
