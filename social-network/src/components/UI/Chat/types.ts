export interface ActionIcon {
  icon: React.ComponentType<{ className?: string }>;
  type: string;
}

export interface MessageDateInfo {
  currentMessageDate: string | null;
  dateSeparatorNode: React.ReactNode;
  unreadSeparatorNode: React.ReactNode;
}

export interface ChatState {
  chatType: string;
  userId: string;
  getCurrentGroup: () => { id?: number; isPayment?: boolean };
}

export interface Message {
  id: string | number;
  type?: string;
  text?: string;
  timestamp?: string | number;
  attachments?: any;
  attachmentsLoading?: boolean;
  forwarding?: string | undefined;
  subscription?: string;
  viewCount?: number;
  role?: string;
  isLoading?: boolean;
  isRead?: boolean;
  inviteDetails?: any;
  sender?: { name?: string; avatar: string; id: string };
}

export interface MessageData {
  message: Message;
  sender: { id: string; name?: string; avatar: string; isOnline: boolean };
  messageVariant: string;
}
