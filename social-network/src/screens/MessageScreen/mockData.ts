import { users } from '@/app/data';
import { MessageWithSender } from '@/components/Chat-refactor/types/chat-types';
import { MessageData } from '@/components/UI/Chat/types';

export const mockMessages: MessageData[] | MessageWithSender[] = [
  {
    message: {
      id: 1,
      user_id: 2,
      type: 'text',
      text: 'Yes, but we need to approach this issue with a cold head and analyze which measures will be effective.',
      timestamp: '11:10',
      isRead: true,
      isLiked: false,
    },
    sender: users[1],
    messageVariant: 'received',
  },
  {
    message: {
      id: 2,
      user_id: 6,
      type: 'text',
      text: 'I agree, but we need to approach this issue with a cold head and analyze which measures will be effective.',
      timestamp: '10:44',
      isRead: true,
      isLiked: true,
    },
    sender: users[4],
    messageVariant: 'received',
  },
  {
    message: {
      id: 3,
      user_id: 6,
      type: 'text',
      text: 'I agree, but we need to approach this issue with a cold head and analyze which measures will be effective.',
      timestamp: '19:12',
      isRead: true,
    },
    sender: users[4],
    messageVariant: 'received',
  },
  {
    message: {
      id: 4,
      user_id: 2,
      type: 'text',
      text: 'Yes, but we need to approach this issue with a cold head and analyze which measures will be effective.',
      timestamp: '22:03',
      isRead: true,
    },
    sender: users[1],
    messageVariant: 'received',
  },
  {
    message: {
      id: 5,
      user_id: 6,
      type: 'text',
      text: 'Unfortunately, not everyone is ready for changes. Many just want everything to remain as it is.',
      timestamp: '14:15',
      isRead: true,
    },
    sender: users[4],
    messageVariant: 'received',
  },
  {
    message: {
      id: 6,
      user_id: 2,
      type: 'text',
      text: 'This is sad, but we cannot just sit and wait for something to change. We need to act, otherwise it will be very sad!',
      timestamp: '17:10',
      isRead: true,
    },
    sender: users[1],
    messageVariant: 'received',
  },
  {
    message: {
      id: 7,
      user_id: 6,
      type: 'text',
      text: 'Actions should be thoughtful, not emotional.',
      timestamp: '07:00',
      isRead: true,
    },
    sender: users[4],
    messageVariant: 'received',
  },
  {
    message: {
      id: 8,
      user_id: 2,
      type: 'text',
      text: 'I agree, but we need to approach this issue with a cold head and analyze which measures will be effective.',
      timestamp: '04:41',
      isRead: false,
    },
    sender: users[1],
    messageVariant: 'received',
  },
  {
    message: {
      id: 9,
      user_id: 4,
      type: 'text',
      text: 'File example',
      timestamp: '16:33',
      attachments: {
        files: [
          {
            name: 'view-off-stroke-rounded',
            date: '26 Feb at 15:41',
            extension: 'svg',
            size: '949 B',
          },
        ],
        links: [
          {
            name: 'Figma',
            preview: 'F',
            previewType: 'letter',
            url: 'www.example.com',
          },
        ],
        photos: ['/pictures/chat/photo.jpg'],
        videos: [
          {
            link: '/pictures/chat/video.jpg',
            timeSpan: '17:10',
          },
        ],
      },
      isRead: true,
    },
    sender: users[2],
    messageVariant: 'received',
  },
  {
    message: {
      id: 10,
      user_id: 4,
      type: 'text',
      text: 'Привет, @nikita_svetlov',
      timestamp: '17:10',
      isRead: true,
    },
    sender: users[2],
    messageVariant: 'received',
  },
  {
    message: {
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
      isRead: true,
    },
    sender: users[1],
    messageVariant: 'sent',
  },
  {
    message: {
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
      isRead: true,
    },
    sender: users[0],
    messageVariant: 'received',
  },
  {
    message: {
      id: 13,
      user_id: 5,
      type: 'text',
      timestamp: '4/24/24',
      viewCount: 1232,
      text: 'Lorem ipsum dolor sit amet consectetur. In elit accumsan amet leo sapien. Tempor diam ipsum adipiscing venenatis ac massa.',
      isRead: true,
    },
    sender: users[3],
    messageVariant: 'received',
  },
  {
    message: {
      id: 14,
      user_id: 6,
      type: 'text',
      timestamp: '09:00',
      viewCount: 1232,
      text: 'Lorem ipsum dolor sit amet consectetur. In elit accumsan amet leo sapien. Tempor diam ipsum adipiscing venenatis ac massa.',
      attachments: {
        photos: [
          '/pictures/chat/phot1.png',
          '/pictures/chat/phot2.png',
          '/pictures/chat/phot3.png',
        ],
      },
      isRead: true,
    },
    sender: users[4],
    messageVariant: 'received',
  },
  {
    message: {
      id: 15,
      user_id: 7,
      type: 'text',
      timestamp: '13:00',
      viewCount: 122,
      text: 'Lorem ipsum dolor sit amet consectetur. In elit accumsan amet leo sapien. Tempor diam ipsum adipiscing venenatis ac massa.',
      isRead: true,
    },
    sender: users[5],
    messageVariant: 'received',
  },
  {
    message: {
      id: 16,
      user_id: 6,
      type: 'text',
      timestamp: '09:00',
      viewCount: 1232,
      text: 'Lorem ipsum dolor sit amet consectetur. In elit accumsan amet leo sapien. Tempor diam ipsum adipiscing venenatis ac massa.',
      forwarding: 13,
      attachments: {
        photos: [
          '/pictures/chat/phot1.png',
          '/pictures/chat/phot2.png',
          '/pictures/chat/phot3.png',
        ],
      },
      isRead: true,
    },
    sender: users[4],
    messageVariant: 'received',
  },
  {
    message: {
      id: 100,
      user_id: 6,
      type: 'text',
      text: 'Lorem ipsum dolor sit amet consectetur. In elit accumsan amet leo sapien. Tempor diam ipsum adipiscing venenatis ac massa.',
      timestamp: '12:34',
      viewCount: 1234,
      attachments: {
        photos: [
          '/pictures/chat/phot1.png',
          '/pictures/chat/phot2.png',
          '/pictures/chat/phot3.png',
        ],
      },
      subscription: 'Admin',
      isRead: true,
    },
    sender: users[4],
    messageVariant: 'received',
  },
  {
    message: {
      id: 101,
      user_id: 2,
      type: 'text',
      text: 'Lorem ipsum dolor sit amet consectetur. In elit accumsan amet leo sapien. Tempor diam ipsum adipiscing venenatis ac massa.',
      timestamp: '12:40',
      viewCount: 421,
      forwarding: 100,
      isRead: true,
    },
    sender: users[1],
    messageVariant: 'received',
  },
];

export const privateChat: MessageWithSender[] | MessageData[] = [
  {
    message: {
      id: 1,
      user_id: 2,
      text: 'Yes, but we need to approach this issue with a cold head and analyze which measures will be effective.',
      timestamp: '11:10',
      isRead: true,
    },
    sender: users[1],
    messageVariant: 'received',
  },
  {
    message: {
      id: 2,
      user_id: 1,
      text: 'I agree, but we need to approach this issue with a cold head and analyze which measures will be effective.',
      timestamp: '10:44',
      isRead: true,
    },
    sender: users[0],
    messageVariant: 'sent',
  },
  {
    message: {
      id: 3,
      user_id: 2,
      text: 'Unfortunately, not everyone is ready for changes. Many just want everything to remain as it is.',
      timestamp: '14:15',
      isRead: true,
    },
    sender: users[1],
    messageVariant: 'received',
  },
  {
    message: {
      id: 4,
      user_id: 1,
      text: 'This is sad, but we cannot just sit and wait for something to change. We need to act, otherwise it will be very sad!',
      timestamp: '17:10',
      isRead: true,
    },
    sender: users[0],
    messageVariant: 'sent',
  },
  {
    message: {
      id: 5,
      user_id: 2,
      text: 'Actions should be thoughtful, not emotional.',
      timestamp: '07:00',
      isRead: true,
    },
    sender: users[1],
    messageVariant: 'received',
  },
  {
    message: {
      id: 6,
      user_id: 1,
      text: 'File example',
      timestamp: '16:33',
      attachments: {
        files: [
          {
            name: 'view-off-stroke-rounded',
            date: '26 Feb at 15:41',
            extension: 'svg',
            size: '949 B',
          },
        ],
        links: [
          {
            name: 'Figma',
            preview: 'F',
            previewType: 'letter',
            url: 'www.example.com',
          },
        ],
        photos: ['/pictures/chat/photo.jpg'],
        videos: [
          {
            link: '/pictures/chat/video.jpg',
            timeSpan: '17:10',
          },
        ],
      },
      isRead: true,
    },
    sender: users[0],
    messageVariant: 'sent',
  },
  {
    message: {
      id: 7,
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
      isRead: true,
    },
    sender: users[1],
    messageVariant: 'received',
  },
  {
    message: {
      id: 8,
      user_id: 1,
      text: 'Lorem ipsum dolor sit amet consectetur. In elit accumsan amet leo sapien.',
      timestamp: '12:34',
      viewCount: 1234,
      attachments: {
        photos: [
          '/pictures/chat/phot1.png',
          '/pictures/chat/phot2.png',
          '/pictures/chat/phot3.png',
        ],
      },
      isRead: true,
    },
    sender: users[0],
    messageVariant: 'sent',
  },
  {
    message: {
      id: 9,
      user_id: 2,
      text: 'Lorem ipsum dolor sit amet consectetur. In elit accumsan amet leo sapien.',
      timestamp: '12:40',
      viewCount: 421,
      forwarding: 8,
      isRead: true,
    },
    sender: users[1],
    messageVariant: 'received',
  },
  {
    message: {
      id: 10,
      user_id: 1,
      text: 'Привет, George!',
      timestamp: '17:10',
      isRead: false,
    },
    sender: users[0],
    messageVariant: 'sent',
  },
];
