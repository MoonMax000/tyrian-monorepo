import { timeAgo } from '@/helpers/timeAgo';
import { chatApi } from '@/store/chatApi';
import {
  addMessage,
  addNotification,
  clearMessages,
  setConnected,
} from '@/store/slices/websocketSlice';
import { socialWebApi } from '@/store/socialWebApi';
import store from '@/store/store';
import { updateOrAddChat } from '@/store/slices/chatListSlice';

const mockWS = 'wss://socialweb-api.tyriantrade.com/ws';
const WS_URL = process.env.NEXT_PUBLIC_NOTIFICATION_WS_URL || mockWS;

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectTimeout: number = 5000;
  private url: string = WS_URL;

  connect(token: string) {
    if (this.socket) {
      console.warn('WebSocket уже подключен');
      return;
    }

    const protocols = ['chat', token];
    console.log('🔌 Подключаем WebSocket с параметрами:', { url: this.url, protocols });

    this.socket = new WebSocket(this.url, protocols);

    this.socket.onopen = () => {
      console.log('✅ WebSocket подключен:', this.url);
      this.socket?.send(
        JSON.stringify({
          action: 'Authorize',
          token: `Bearer ${token}`,
        }),
      );

      store.dispatch(setConnected(true));
      this.startPing();
    };

    this.socket.onmessage = async (event) => {
      console.log('📩 Получено сообщение:', event.data);

      if (!event.data || event.data === 'null') {
        console.warn('⚠️ Пустое сообщение от сервера, пропускаем...');
        return;
      }

      try {
        const parsedData = JSON.parse(event.data);
        const messages = Array.isArray(parsedData) ? parsedData : [parsedData];

        for (const message of messages) {
          if (message.message?.type === 'message group_chat') {
            const allChats = store.getState().chatList.chats;
            const chat = allChats.find((c) => c.id === message.targetUserId);

            if (chat) {
              const isChatOpen = window.location.pathname === `/chats/group/${chat.id}`;

              store.dispatch(
                updateOrAddChat({
                  ...chat,
                  new_messages_count: isChatOpen
                    ? chat.new_messages_count // не увеличиваем
                    : (chat.new_messages_count || 0) + 1, // увеличиваем
                  last_timestamp: message.timestamp,
                }),
              );
            }

            continue;
          }

          if (!message?.targetUserId || !message?.timestamp) {
            console.warn('⚠️ Отсутствуют обязательные поля в сообщении:', message);
            continue;
          }

          let notificationText = '';
          let textLink = '';
          let type = 'text';

          if (typeof message.message === 'string') {
            notificationText = message.message;
          } else if (message.message?.type === 'like_post') {
            if (!message.message?.target_user_name || !message.message?.post_title) {
              console.warn('⚠️ Недостаточно данных для like_post:', message.message);
              continue;
            }
            type = 'like_post';
            notificationText = `Liked your post:`;
            textLink = message.message.post_title;
          } else if (message.message?.type === 'new_comment') {
            type = 'new_comment';
            notificationText = message.message.comment;
            textLink = `post/${message.message.data}`;
          } else if (message.message?.type === 'subscribe_post') {
            if (!message.message?.target_user_name || !message.message?.post_title) {
              console.warn('⚠️ Недостаточно данных для subscribe_post:', message.message);
              continue;
            }
            type = 'subscribe_post';
            notificationText = `Bought your post:`;
            textLink = message.message.post_title;
          } else if (message.message?.type === 'invite group' || 'add group') {
            console.log(message, 'приглашение');
          } else {
            console.warn('⚠️ Неизвестный формат сообщения:', message);
            continue;
          }
          if (message.message?.type === 'invite group' || message.message?.type === 'add group') {
            store.dispatch(
              addMessage({
                targetUserId: message.targetUserId,
                message: 'You have been invited to the group',
                timestamp: message.timestamp,
              }),
            );
            store.dispatch(
              addNotification({
                uid: message.targetUserId,
                id: message.id,
                email: message.message.target_user_email,
                photo: '/def-logo.png',
                type,
                name: 'System',
                date: timeAgo(message.timestamp),
                text: 'You have been invited to the group',
                textLink: 'chats/group/' + message.targetUserId,
              }),
            );
            store.dispatch(chatApi.util.invalidateTags(['chatList']));
          } else {
            const rawId = message.targetUserId;
            const uid =
              typeof rawId === 'string' && rawId.includes('_') ? rawId.split('_')[1] : rawId;

            if (!uid) {
              console.warn('⛔ [WS] Пропущен getUserById: невалидный targetUserId =', rawId);
              continue;
            }

            const result = await store.dispatch(socialWebApi.endpoints.getUserById.initiate(uid));

            const userData = result?.data;

            store.dispatch(
              addMessage({
                targetUserId: message.targetUserId,
                message: notificationText,
                timestamp: message.timestamp,
              }),
            );

            store.dispatch(
              addNotification({
                uid: message.targetUserId,
                photo: userData?.avatar_url || '/def-logo.png',
                email: message.message.target_user_email,
                type,
                status: message?.status,
                id: message?.id,
                name: userData?.username || message.message?.target_user_name || 'Unknown User',
                date: timeAgo(message.timestamp),
                text: notificationText,
                textLink,
              }),
            );
          }
        }
      } catch (error) {
        console.log('❗ Ошибка парсинга сообщения:', error);
      }
    };

    this.socket.onclose = (event) => {
      console.warn(
        `⚠️ WebSocket отключен. Код: ${event.code}, Причина: ${event.reason || 'нет данных'}`,
      );

      store.dispatch(clearMessages());
      store.dispatch({ type: 'websocket/clearSubscribers' });
      store.dispatch(setConnected(false));
      this.socket = null;

      setTimeout(() => this.connect(token), this.reconnectTimeout);
    };
  }

  sendMessage(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.log('🚫 WebSocket не подключен');
    }
  }

  startPing() {
    setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ action: 'ping' }));
        console.log('📡 Ping отправлен серверу');
      } else {
        console.warn('⚠️ WebSocket закрыт, ping не отправлен');
      }
    }, 30000);
  }

  close() {
    console.log('🔌 Закрываем WebSocket...');
    this.socket?.close();
    this.socket = null;
  }
}

export const websocketService = new WebSocketService();
