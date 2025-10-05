export interface User {
  id: number;
  avatar: string;
  name: string;
  isOnline: boolean;
  isMuted?: boolean;
}

export type PhotoData = string;

export interface VideoData {
  link: string;
  timeSpan: string;
}

export interface FileData {
  name: string;
  size: string;
  date: string;
  extension: string;
}

export interface LinkData {
  name: string;
  url: string;
  preview: string;
  previewType: 'letter' | 'url';
}

export interface Message {
  id: number;
  user_id: User['id'];
  type?: 'text' | 'invite';
  text?: string;
  isLoading?: boolean;
  attachmentsLoading?: boolean;
  timestamp?: string;
  role?: string;
  isLiked?: boolean;
  isRead?: boolean;
  viewCount?: number;
  forwarding?: number;
  attachments?: {
    photos?: PhotoData[];
    videos?: VideoData[];
    files?: FileData[];
    links?: LinkData[];
  };
  inviteDetails?: {
    groupId: Group['id'];
    groupName: string;
    groupSlogan: string;
    invitedByUserId?: User['id'];
    invitedByUserName?: User['name'];
  };
  subscription?: string;
}

export interface Group {
  id: number;
  avatar: string;
  name: string;
  users: User['id'][];
  messages: Message['id'][];
  isMuted?: boolean;
  isPayment?: boolean;
}

export interface UserRelationData {
  user_id: User['id'];
  messages: Message['id'][];
  chat_details: {
    notifications: boolean;
    photos?: number;
    videos?: number;
    links?: number;
    files?: number;
  };
}

export interface ChatState {
  chatType: 'user' | 'group' | null;
  chatId: number | null;
  userId: number;
  users: User[];
  messages: Message[];
  groups: Group[];
  userRelationData: UserRelationData[];
  joinGroup?: (groupId: number) => void;
}

export const users: User[] = [
  { id: 1, avatar: '/pictures/chat/avatar4.jpg', name: 'Jack Brown', isOnline: true },
  { id: 2, avatar: '/pictures/chat/avatar5.jpg', name: 'Brendan Collins', isOnline: true },
  { id: 3, avatar: '/pictures/chat/avatar6.jpg', name: 'Ms. Damon Borer', isOnline: false },
  { id: 4, avatar: '/pictures/chat/avatar7.jpg', name: 'Jack Brown', isOnline: false },
  { id: 5, avatar: '/pictures/chat/avatar8.jpg', name: 'George Taylor', isOnline: false },
  { id: 6, avatar: '/pictures/chat/avatar10.jpg', name: 'Antonio Leuschke', isOnline: false },
  { id: 7, avatar: '/pictures/chat/avatar8.jpg', name: 'Nicholas Price', isOnline: false },
  { id: 8, avatar: '/pictures/chat/avatar10.jpg', name: 'Brendan Collins', isOnline: false },
];

export interface LinkData {
  name: string;
  url: string;
  preview: string;
  previewType: 'letter' | 'url';

  title?: string;
  description?: string;
  imageUrl?: string;
}

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(today.getDate() - 2);

const formatISO = (date: Date, hour: number, minute: number) => {
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

export const messages: Message[] = [
  {
    id: 1,
    user_id: 2,
    text: 'Yes, but we need to approach this issue with a cold head and analyze which measures will be effective.',
    timestamp: '11:10',
  },
  {
    id: 2,
    user_id: 6,
    text: 'I agree, but we need to approach this issue with a cold head and analyze which measures will be effective.',
    timestamp: '10:44',
  },
  {
    id: 3,
    user_id: 6,
    text: 'I agree, but we need to approach this issue with a cold head and analyze which measures will be effective.',
    timestamp: '19:12',
  },
  {
    id: 4,
    user_id: 2,
    text: 'Yes, but we need to approach this issue with a cold head and analyze which measures will be effective.',
    timestamp: '22:03',
  },
  {
    id: 5,
    user_id: 6,
    text: 'Unfortunately, not everyone is ready for changes. Many just want everything to remain as it is.',
    timestamp: '14:15',
  },
  {
    id: 6,
    user_id: 2,
    text: 'This is sad, but we cannot just sit and wait for something to change. We need to act, otherwise it will be very sad!',
    timestamp: '17:10',
  },
  { id: 7, user_id: 6, text: 'Actions should be thoughtful, not emotional.', timestamp: '07:00' },
  {
    id: 8,
    user_id: 2,
    text: 'I agree, but we need to approach this issue with a cold head and analyze which measures will be effective.',
    timestamp: '04:41',
  },
  {
    id: 9,
    user_id: 4,
    text: 'File example',
    timestamp: '16:33',
    attachments: {
      files: [
        {
          name: 'view-off-stroke-rounded',
          date: '26 Фев в 15:41',
          extension: 'svg',
          size: '949 B',
        },
      ],
      links: [{ name: 'Figma', preview: 'F', previewType: 'letter', url: 'www.example.com' }],
      photos: ['/pictures/chat/photo.jpg'],
      videos: [{ link: '/pictures/chat/video.jpg', timeSpan: '17:10' }],
    },
  },
  { id: 10, user_id: 4, text: 'Привет, @nikita_svetlov', timestamp: '17:10' },
  {
    id: 11,
    user_id: 2,
    type: 'invite',
    timestamp: '13:00',
    inviteDetails: {
      groupId: 1,
      groupName: 'NanoTech',
      groupSlogan: 'Welcome to the future!',
      invitedByUserId: 2,
      invitedByUserName: 'George Taylor (admin)',
    },
  },
  {
    id: 12,
    user_id: 1,
    type: 'invite',
    timestamp: '13:15',
    inviteDetails: {
      groupId: 2,
      groupName: 'Channel of Vasily Terkin',
      groupSlogan: "Let's build something!",
      invitedByUserId: 1,
      invitedByUserName: 'Андрей Петров',
    },
  },
  {
    id: 13,
    user_id: 5,
    timestamp: '4/24/24',
    viewCount: 1232,
    text: 'Lorem ipsum dolor sit amet consectetur. In elit accumsan amet leo sapien. Tempor diam ipsum adipiscing venenatis ac massa. ',
  },
  {
    id: 14,
    user_id: 6,
    timestamp: '09:00',
    viewCount: 1232,
    text: 'Lorem ipsum dolor sit amet consectetur. In elit accumsan amet leo sapien. Tempor diam ipsum adipiscing venenatis ac massa. ',
    attachments: {
      photos: ['/pictures/chat/phot1.png', '/pictures/chat/phot2.png', '/pictures/chat/phot3.png'],
    },
  },
  {
    id: 15,
    user_id: 7,
    timestamp: '13:00',
    viewCount: 122,
    text: 'Lorem ipsum dolor sit amet consectetur. In elit accumsan amet leo sapien. Tempor diam ipsum adipiscing venenatis ac massa. ',
  },
  {
    id: 16,
    user_id: 6,
    timestamp: '09:00',
    viewCount: 1232,
    text: 'Lorem ipsum dolor sit amet consectetur. In elit accumsan amet leo sapien. Tempor diam ipsum adipiscing venenatis ac massa. ',
    forwarding: 13,
    attachments: {
      photos: ['/pictures/chat/phot1.png', '/pictures/chat/phot2.png', '/pictures/chat/phot3.png'],
    },
  },
  {
    id: 100,
    user_id: 6,
    text: 'Lorem ipsum dolor sit amet consectetur. In elit accumsan amet leo sapien. Tempor diam ipsum adipiscing venenatis ac massa. ',
    timestamp: '12:34',
    viewCount: 1234,
    attachments: {
      photos: ['/pictures/chat/phot1.png', '/pictures/chat/phot2.png', '/pictures/chat/phot3.png'],
    },
    subscription: 'Admin',
  },
  {
    id: 101,
    user_id: 2,
    text: 'Lorem ipsum dolor sit amet consectetur. In elit accumsan amet leo sapien. Tempor diam ipsum adipiscing venenatis ac massa. ',
    timestamp: '12:40',
    viewCount: 421,
    forwarding: 100,
  },
];

export const userRelationData: UserRelationData[] = [
  { user_id: 1, messages: [12], chat_details: { notifications: false } },
  {
    user_id: 2,
    messages: [1, 2, 3, 4, 5, 6, 7, 11, 101],
    chat_details: { notifications: false, photos: 745, videos: 18, links: 18, files: 8 },
  },
  { user_id: 3, messages: [], chat_details: { notifications: false } },
  { user_id: 4, messages: [9, 10], chat_details: { notifications: true } },
  { user_id: 4, messages: [9, 10], chat_details: { notifications: true } },
  { user_id: 4, messages: [9, 10], chat_details: { notifications: true } },
  { user_id: 5, messages: [9, 10], chat_details: { notifications: true } },
  { user_id: 6, messages: [9, 10], chat_details: { notifications: true } },
  { user_id: 7, messages: [9, 10], chat_details: { notifications: true } },
  { user_id: 8, messages: [9, 10], chat_details: { notifications: true } },
  { user_id: 1, messages: [100, 101], chat_details: { notifications: true } },
  { user_id: 2, messages: [100, 101], chat_details: { notifications: true } },
  { user_id: 6, messages: [2, 3, 5, 7, 100], chat_details: { notifications: true } },
];

export const groups: Group[] = [
  {
    id: 1,
    avatar: '/pictures/chat/group1.jpg',
    name: 'NanoTech',
    users: [1, 2, 3, 4, 6],
    messages: [13, 14, 15, 16],
    isMuted: true,
    isPayment: true,
  },
  {
    id: 2,
    avatar: '/pictures/chat/avatar2.jpg',
    name: 'Channel of Vasily Terkin',
    users: [1, 2, 3, 4, 20],
    messages: [3, 4, 5],
    isMuted: true,
  },
  {
    id: 3,
    avatar: '/pictures/chat/avatar3.jpg',
    name: 'Group of contracts',
    users: [1, 2, 3, 4, 20],
    messages: [1, 2, 3],
  },
  {
    id: 4,
    avatar: '/pictures/chat/group1.jpg',
    name: 'Nano Tech',
    users: [],
    messages: [],
  },
  {
    id: 99,
    avatar: '/pictures/chat/group1.jpg',
    name: 'AI News Channel',
    users: [1, 2, 20],
    messages: [100, 101],
    isMuted: false,
    isPayment: false,
  },
];

export const photoLinks: PhotoData[] = Array(15).fill('/pictures/chat/photo.jpg');
export const videos: VideoData[] = Array(5).fill({
  link: '/pictures/chat/video.jpg',
  timeSpan: '3:29',
});
export const links: { [key in string]: LinkData[] } = {
  february: [
    { name: 'Figma', url: 'www.example.com', preview: 'F', previewType: 'letter' },
    { name: 'WikiHow', url: 'www.example.com/page219', preview: 'W', previewType: 'letter' },
  ],
  january: [
    {
      name: 'AXA соц.сеть (Copy)',
      url: 'www.example.com/page219',
      preview: '/pictures/chat/link_preview.jpg',
      previewType: 'url',
    },
  ],
};
export const files: FileData[] = [
  {
    name: 'view-off-slash-stroke-rounded',
    size: '949 B',
    date: '26 Фев в 15:41',
    extension: 'svg',
  },
  { name: 'view-off-stroke-rounded', size: '949 B', date: '26 Фев в 15:41', extension: 'svg' },
];
