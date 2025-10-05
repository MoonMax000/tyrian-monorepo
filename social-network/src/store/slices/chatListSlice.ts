import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatItem } from '../chatApi';

interface ChatListState {
  chats: ChatItem[];
}

const initialState: ChatListState = {
  chats: [],
};

const chatListSlice = createSlice({
  name: 'chatList',
  initialState,
  reducers: {
    setChats(state, action: PayloadAction<ChatItem[]>) {
      state.chats = action.payload;
    },
    updateOrAddChat(state, action: PayloadAction<ChatItem>) {
        const existingIndex = state.chats.findIndex(chat => chat.id === action.payload.id);
      
        if (existingIndex !== -1) {
          state.chats[existingIndex] = {
            ...state.chats[existingIndex],
            ...action.payload,
          };
        } else {
          state.chats.unshift(action.payload);
        }
      
        state.chats.sort((a, b) => {
          const aTime = typeof a.last_timestamp === 'string' ? new Date(a.last_timestamp).getTime() : a.last_timestamp;
          const bTime = typeof b.last_timestamp === 'string' ? new Date(b.last_timestamp).getTime() : b.last_timestamp;
          return bTime - aTime;
        });
      }
  },
});

export const { setChats, updateOrAddChat } = chatListSlice.actions;
export default chatListSlice.reducer;
    