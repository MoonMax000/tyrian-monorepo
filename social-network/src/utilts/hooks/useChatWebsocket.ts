import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { connectWebSocket, disconnectWebSocket } from '@/store/slices/chatWebsocketSlice';
import { useParams } from 'next/navigation';

export const useChatWebsocket = () => {
  const dispatch = useAppDispatch();
  const { id: chatId } = useParams<{ id: string }>();

  useEffect(() => {
    if (!chatId) return;
    dispatch(connectWebSocket(chatId));
    return () => {
      dispatch(disconnectWebSocket(chatId));
    };
  }, [dispatch, chatId]);
};
