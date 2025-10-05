import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import searchReducer from './slices/searchSlice';
import websocketReducer from '@/store/slices/websocketSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import { socialWebApi } from './socialWebApi';
import userReducer from './slices/userSlice';
import { chatApi } from './chatApi';
import chatReducer from './slices/chatSlice';
import chatWebsocketSlice from './slices/chatWebsocketSlice';
import chatListSlice from './slices/chatListSlice';
import { authApi } from './authApi';

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [socialWebApi.reducerPath]: socialWebApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    subscription: subscriptionReducer,
    search: searchReducer,
    websocket: websocketReducer,
    user: userReducer,
    chat: chatReducer,
    chatWebsocket: chatWebsocketSlice,
    chatList: chatListSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .concat(chatApi.middleware)
      .concat(socialWebApi.middleware)
      .concat(authApi.middleware),
});

declare global {
  interface Window {
    store: typeof store;
  }
}

if (typeof window !== 'undefined') {
  window.store = store;
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
