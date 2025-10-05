import UserPhoto from '@/assets/def-logo.png';

export interface SubscriberItem {
  uid?: string;
  photo: string;
  type: string;
  name: string;
  date: string;
  text: string;
  textLink: string;
  email?: string;
  id?: string;
  status?: 'read' | 'unread';
}

export const notificationsData: SubscriberItem[] = [
  {
    photo: UserPhoto.src,
    type: 'text',
    name: 'Username41',
    date: '4 hours ago',
    text: 'Added a new comment to your post:',
    textLink: 'Post Title',
  },
  {
    photo: UserPhoto.src,
    type: 'file',
    name: 'Username41',
    date: '4 hours ago',
    text: 'Published a new post:',
    textLink:
      'AI Constructs Threaten Emerging Economies - A New Wave of Unemployment and Inequality',
  },
  {
    photo: UserPhoto.src,
    type: 'person',
    name: 'Username41',
    date: '4 hours ago',
    text: 'Now following your updates',
    textLink: '',
  },
  {
    photo: UserPhoto.src,
    type: 'like',
    name: 'Username41',
    date: '4 hours ago',
    text: 'Liked your post:',
    textLink: 'Post Title',
  },
  {
    photo: UserPhoto.src,
    type: 'file',
    name: 'Username41',
    date: '4 hours ago',
    text: 'Published a new post: ',
    textLink: 'Post Title',
  },
  {
    photo: UserPhoto.src,
    type: 'link',
    name: 'Username41',
    date: '4 hours ago',
    text: 'Mentioned you in a comment on the post:',
    textLink: 'Post Title',
  },
];
