import { SubscriberItem } from '@/components/Notifications/constatnts';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WebSocketMessage {
  targetUserId: string;
  message: string;
  timestamp: number;
}

interface WebSocketState {
  messages: WebSocketMessage[];
  subscribers: SubscriberItem[];
  isConnected: boolean;
}

const initialState: WebSocketState = {
  messages: [],
  subscribers: [],
  isConnected: false,
};

const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<WebSocketMessage>) => {
      state.messages.push(action.payload);
      console.log(state, action);
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    addNotification: (state, action: PayloadAction<SubscriberItem>) => {
      state.subscribers = [action.payload, ...state.subscribers];
    },
    removeByUid: (state, action: PayloadAction<string>) => {
      const uid = action.payload;
      state.messages = state.messages.filter((msg) => msg.targetUserId !== uid);
      state.subscribers = state.subscribers.filter((sub) => sub.uid !== uid);
      console.log(`🗑 Удалены сообщения и подписчики с uid: ${uid}`);
    },
    removeByMessageUid: (state, action: PayloadAction<string>) => {
      const uuid = action.payload;
      state.subscribers = state.subscribers.filter((sub) => sub.id !== uuid);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    clearSubscribers: (state) => {
      state.subscribers = [];
    },
    updateSubscriberPhoto: (state, action: PayloadAction<{ uid: string; photo: string }>) => {
      const target = state.subscribers.find((s) => s.uid === action.payload.uid);
      if (target) {
        target.photo = action.payload.photo;
      }
    },
  },
});

export const {
  addMessage,
  setConnected,
  addNotification,
  removeByMessageUid,
  removeByUid,
  clearMessages,
  clearSubscribers,
  updateSubscriberPhoto,
} = websocketSlice.actions;
export default websocketSlice.reducer;
