import { getCookie } from '../cookie';
import { addMessage, setConnectionStatus } from '@/store/slices/chatWebsocketSlice';
import { AppDispatch } from '@/store/store';
import store from '@/store/store';
import { updateOrAddChat } from '@/store/slices/chatListSlice';

const mockWS = 'wss://socialweb-chat-api.tyriantrade.com/ws';
const WS_URL = process.env.NEXT_PUBLIC_CHAT_WS_URL || mockWS;
const accessToken = getCookie('sessionid');

export interface WsMessageData {
  type: string;
  data: {
    nick: string;
    features: string[];
    id: string;
    comment: string;
    data: string;
    flag_comments: boolean;
    links: string[];
    sender: string;
    timestamp: number;
  };
}

export interface WsSendPrivateMessage {
  data: string;
  recipient: string;
  extradata: string;
  duration: number;
  comment: string;
  flag_comments: boolean;
  links: string[];
}

interface SocketInfo {
  socket: WebSocket;
  messageCallbacks: ((message: WsMessageData) => void)[];
}

class ChatWebSocketService {
  private sockets: Map<string, SocketInfo> = new Map();
  private reconnectTimeout: number = 5000;
  private url: string = WS_URL;
  private dispatch: AppDispatch | null = null;

  constructor(dispatch?: AppDispatch) {
    this.dispatch = dispatch || null;
  }

  public onMessage(chatId: string, callback: (message: WsMessageData) => void) {
    const socketInfo = this.sockets.get(chatId);
    if (socketInfo) {
      socketInfo.messageCallbacks.push(callback);
    } else {
      console.warn(`Нет активного соединения для chatId: ${chatId}`);
    }
  }

  public offMessage(chatId: string, callback: (message: WsMessageData) => void) {
    const socketInfo = this.sockets.get(chatId);
    if (socketInfo) {
      socketInfo.messageCallbacks = socketInfo.messageCallbacks.filter((cb) => cb !== callback);
    }
  }

  public connect(chatId: string) {
    if (!accessToken) return;
    if (this.sockets.has(chatId)) {
      const socketInfo = this.sockets.get(chatId)!;
      if (socketInfo.socket.readyState === WebSocket.OPEN) {
        console.warn(`WebSocket уже подключен для chatId: ${chatId}`);
        return;
      }
      this.close(chatId);
    }

    const protocols = ['chat', chatId, accessToken || ''];
    console.log('url:', this.url, 'protocols:', protocols);
    console.log(`Подключение WebSocket для chatId: ${chatId}, протоколы:`, protocols);

    const socket = new WebSocket(this.url, protocols);
    const socketInfo: SocketInfo = { socket, messageCallbacks: [] };
    this.sockets.set(chatId, socketInfo);

    if (this.dispatch) {
      this.dispatch(setConnectionStatus({ chatId: chatId, status: 'connecting' }));
    }

    socket.onopen = () => {
      console.log(`WebSocket подключен для chatId: ${chatId}`);
      if (this.dispatch) {
        this.dispatch(setConnectionStatus({ chatId: chatId, status: 'connected' }));
      }
    };

    socket.onmessage = async (event) => {
      try {
        const messageData = JSON.parse(event.data) as WsMessageData;

        if (!messageData || !messageData.data || !messageData.data.sender) return;

        const allChats = store.getState().chatList.chats;

        if (chatId.startsWith('private_')) {
          const matchingChat = allChats.find(
            (chat) => chat.private_chat_contact_user_id === messageData.data.sender,
          );

          if (matchingChat) {
            const isOwnMessage = messageData.data.sender === matchingChat.user_id;

            const updatedChat = {
              ...matchingChat,
              last_message: {
                id: messageData.data.id,
                chat_id: matchingChat.id,
                sender: messageData.data.sender,
                recipient: matchingChat.user_id,
                message: messageData.data.data,
                comment: messageData.data.comment,
                flag_comments: messageData.data.flag_comments,
                label: '',
                links: messageData.data.links,
                timestamp: new Date(messageData.data.timestamp).toISOString(),
              },
              last_timestamp: messageData.data.timestamp,
              new_messages_count:
                isOwnMessage ||
                window.location.pathname ===
                  `/chats/message/${matchingChat.private_chat_contact_user_id}`
                  ? matchingChat.new_messages_count
                  : matchingChat.new_messages_count + 1,
            };

            store.dispatch(updateOrAddChat(updatedChat));
          }
        }

        if (this.dispatch) {
          this.dispatch(addMessage({ chatId: chatId, message: messageData }));
        }
        socketInfo.messageCallbacks.forEach((callback) => callback(messageData));
      } catch (error) {
        console.error(`Ошибка парсинга сообщения для chatId ${chatId}:`, error);
      }
    };

    socket.onclose = () => {
      console.log(`WebSocket закрыт для chatId: ${chatId}`);
      this.sockets.delete(chatId);
      if (this.dispatch) {
        this.dispatch(setConnectionStatus({ chatId: chatId, status: 'disconnected' }));
      }

      setTimeout(() => {
        if (!this.sockets.has(chatId)) {
          console.log(`Попытка переподключения для chatId: ${chatId}`);
          this.connect(chatId);
        }
      }, this.reconnectTimeout);
    };

    socket.onerror = (error) => {
      console.warn(`Ошибка WebSocket для chatId ${chatId}:`, error);

      this.sockets.delete(chatId);
      if (this.dispatch) {
        this.dispatch(setConnectionStatus({ chatId: chatId, status: 'disconnected' }));
      }
    };
  }

  public sendMessage(
    chatId: string,
    data: string,
    recipient: string,
    extradata: string = '',
    duration: number = 100,
    comment: string = '',
    flag_comments: boolean = false,
    links: string[] = [],
  ): void {
    const socketInfo = this.sockets.get(chatId);
    console.log(socketInfo);
    if (socketInfo && socketInfo.socket.readyState === WebSocket.OPEN) {
      const message: WsSendPrivateMessage = {
        data,
        recipient,
        extradata,
        duration,
        comment,
        flag_comments,
        links,
      };
      console.log(`📤 Отправлено сообщение для chatId ${chatId}:`, message);
      socketInfo.socket.send(`MSG ${JSON.stringify(message)}`);
    } else {
      console.log(`🚫 WebSocket не подключен для chatId: ${chatId}`);
    }
  }

  public LastTime(chatId: string) {
    const mySocketInfo = Array.from(this.sockets.entries()).find(([key]) =>
      key.startsWith('private_'),
    )?.[1];

    if (!mySocketInfo) {
      return;
    }

    if (mySocketInfo.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    const payload = `LASTTIME {"chat_id": "${chatId}", "last_timestamp": ${Date.now()}}`;
    mySocketInfo.socket.send(payload);
  }

  public AddUsers(chatId: string, action: 'add' | 'delete', userIds: string[]) {
    const socketInfo = this.sockets.get(chatId);
    if (socketInfo && socketInfo.socket.readyState === WebSocket.OPEN) {
      socketInfo.socket.send(
        `CLOSEUSERLIST {"data": "${action}", "user_id": ${JSON.stringify(userIds)}}`,
      );
    }
  }

  public close(chatId: string) {
    const socketInfo = this.sockets.get(chatId);
    if (socketInfo) {
      socketInfo.socket.close();
      this.sockets.delete(chatId);
      console.log(`WebSocket закрыт вручную для chatId: ${chatId}`);
      if (this.dispatch) {
        this.dispatch(setConnectionStatus({ chatId: chatId, status: 'disconnected' }));
      }
    }
  }

  public closeAll() {
    this.sockets.forEach((_, chatId) => this.close(chatId));
  }
}

export let chatWebsocketService: ChatWebSocketService;

export const initializeWebSocketService = (dispatch: AppDispatch) => {
  chatWebsocketService = new ChatWebSocketService(dispatch);
};
