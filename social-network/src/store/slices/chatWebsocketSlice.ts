import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';
import { chatWebsocketService, WsMessageData } from '@/utilts/websocket/chatWebsocket';

interface ChatState {
  connections: {
    [chatId: string]: {
      connectionStatus: 'disconnected' | 'connecting' | 'connected';
      messages: WsMessageData[];
    };
  };
  currentChatId: string | null;
  draftMessage: string;
}

const initialState: ChatState = {
  connections: {},
  currentChatId: null,
  draftMessage: '',
};

const chatWebsocketSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConnectionStatus: (
      state,
      action: PayloadAction<{
        chatId: string;
        status: ChatState['connections'][string]['connectionStatus'];
      }>,
    ) => {
      const { chatId, status } = action.payload;
      if (!state.connections[chatId]) {
        state.connections[chatId] = { connectionStatus: 'disconnected', messages: [] };
      }
      state.connections[chatId].connectionStatus = status;
    },
    addMessage: (state, action: PayloadAction<{ chatId: string; message: WsMessageData }>) => {
      const { chatId, message } = action.payload;
      if (!state.connections[chatId]) {
        state.connections[chatId] = { connectionStatus: 'disconnected', messages: [] };
      }
      const messageExists = state.connections[chatId].messages.some(
        (msg) => msg?.data?.id === message?.data?.id,
      );
      if (!messageExists) {
        state.connections[chatId].messages.push(message);
      }
    },
    clearMessages: (state, action: PayloadAction<string>) => {
      const chatId = action.payload;
      if (state.connections[chatId]) {
        state.connections[chatId].messages = [];
      }
    },
    setCurrentChatId: (state, action: PayloadAction<string | null>) => {
      state.currentChatId = action.payload;
    },
    setDraftMessage: (state, action: PayloadAction<string>) => {
      state.draftMessage = action.payload;
    },
    clearDraftMessage: (state) => {
      state.draftMessage = '';
    },
  },
});

export const {
  setConnectionStatus,
  addMessage,
  clearMessages,
  setCurrentChatId,
  setDraftMessage,
  clearDraftMessage,
} = chatWebsocketSlice.actions;

export const connectWebSocket = (chatId: string) => (dispatch: AppDispatch) => {
  dispatch(setConnectionStatus({ chatId, status: 'connecting' }));
  dispatch(setCurrentChatId(chatId));

  chatWebsocketService?.onMessage(chatId, (message: WsMessageData) => {
    dispatch(addMessage({ chatId, message }));
    if (message?.type === 'connect') {
      dispatch(setConnectionStatus({ chatId, status: 'connected' }));
      lastTime(chatId);
    }
  });

  console.log(chatWebsocketService, 'for ', chatId);
  chatWebsocketService?.connect(chatId);
};

export const disconnectWebSocket = (chatId: string) => (dispatch: AppDispatch) => {
  chatWebsocketService?.close(chatId);
  dispatch(setConnectionStatus({ chatId, status: 'disconnected' }));
  dispatch(clearMessages(chatId));
};

export const sendChatMessage =
  (
    chatId: string,
    data: string,
    recipient: string,
    extradata: string = '',
    duration: number = 100,
    comment: string = '',
    flag_comments: boolean = false,
    links: string[] = [],
  ) =>
  (dispatch: AppDispatch) => {
    chatWebsocketService?.sendMessage(
      chatId,
      data,
      recipient,
      extradata,
      duration,
      comment,
      flag_comments,
      links,
    );
    dispatch(clearDraftMessage());
    lastTime(chatId);
  };

export const lastTime = (chatId: string) => {
  chatWebsocketService?.LastTime(chatId);
};

export default chatWebsocketSlice.reducer;
