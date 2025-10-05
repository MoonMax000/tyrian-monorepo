// import { Users, UserPlus } from 'lucide-react';
// import { users } from '@/app/data';
// import Button from '@/components/UI/Button/Button';
// import ProfileItem from './ProfileItem';
// import DetailsItem from './DetailsItem';

// interface DetailsUsersProps {
//   onAddUsersClick: () => void;
// }

const DetailsUsers = () => {
  return (
    <div>
      <div className='grid place-items-center h-[76px] border-b border-onyxGrey'>
        <span className='text-[17px]'>Участники</span>
      </div>
      {/* <DetailsItem
        icon={<Users />}
        className='pt-4 pb-3 pl-6 w-full h-[84px]'
        topBorder
        onClick={onAddUsersClick}
        sideElement={<Button className='bg-white/[8%] absolute right-6' icon={<UserPlus />} />}
      >
        325 Участников
      </DetailsItem>
      <div className='flex flex-col gap-4 px-6 pb-6'>
        <ProfileItem user={users[1]} />
        <ProfileItem user={users[0]} />
        <ProfileItem user={users[1]} />
        <ProfileItem user={users[0]} />
        <ProfileItem user={users[1]} />
        <ProfileItem user={users[0]} />
        <ProfileItem user={users[1]} />
        <ProfileItem user={users[0]} />
      </div> */}
    </div>
  );
};

export default DetailsUsers;
