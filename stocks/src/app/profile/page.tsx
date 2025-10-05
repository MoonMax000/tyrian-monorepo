import ProfileScreen from '@/screens/ProfileScreen';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Профиль',
};

const Profile = () => {
  return <ProfileScreen />;
};

export default Profile;
