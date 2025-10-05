import UserPhoto from '@/assets/def-logo.png';
import UserPhoto2 from '@/assets/avatar1.jpg';
import UserPhoto3 from '@/assets/avatar5.jpg';
import UserPhoto4 from '@/assets/avatar3.jpg';
import UserPhoto5 from '@/assets/avatar4.jpg';

export interface RecommendedItem {
  photo: string;
  name: string;
  text: string;
}

export const recommendedData: RecommendedItem[] = [
  {
    photo: UserPhoto.src,
    name: 'John Smith',
    text: '12 200 Followers',
  },
  {
    photo: UserPhoto2.src,
    name: 'John Smith',
    text: '1 200 Followers',
  },
  {
    photo: UserPhoto3.src,
    name: 'John Smith',
    text: '3 600 Followers',
  },
  {
    photo: UserPhoto4.src,
    name: 'John Smith',
    text: '400 Followers',
  },
  {
    photo: UserPhoto5.src,
    name: 'John Smith',
    text: '1 520 Followers',
  },
];
