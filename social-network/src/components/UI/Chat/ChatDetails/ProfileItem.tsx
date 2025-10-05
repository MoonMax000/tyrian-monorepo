import { Avatar, AvatarImage } from '@/components/shadcnui/avatar';
import { User } from '@/app/data';

const ProfileItem = ({ user }: { user: User }) => {
  return (
    <div className='flex items-center px-[24px] py-[12px] gap-3 cursor-pointer hover:bg-moonlessNight'>
      <Avatar className='flex justify-center items-center size-8 '>
        <AvatarImage
          className='object-cover'
          src={user?.avatar}
          width={6}
          height={6}
          alt={user?.name}
        />
      </Avatar>
      <div className='flex flex-col'>
        <span className='font-medium text-[13px]'>{user?.name}</span>
        <span className='text-[13px] opacity-[48%]'>Online</span>
      </div>
    </div>
  );
};

export default ProfileItem;
