import { RootState } from '../store';
import { WsMessageData } from '@/utilts/websocket/chatWebsocket';

export const selectAllChatMessages = (state: RootState): WsMessageData[] => {
  return Object.values(state.chatWebsocket.connections).flatMap(
    (connection) => connection.messages || [],
  );
};
