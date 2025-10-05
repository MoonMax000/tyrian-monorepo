import IconProfile from '@/assets/user-menu/logo-profil.svg';
import IconLogout from '@/assets/user-menu/icon-log-out.svg';
import IconSettings from '@/assets/user-menu/icon-settings.svg';
import { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';

interface DropDownNavProps {
  setDropdownVisible: Dispatch<SetStateAction<boolean>>;
  logOut: () => void;
}

const DropDownNav: React.FC<DropDownNavProps> = ({
  setDropdownVisible,
  logOut,
}) => {
  const router = useRouter();
  return (
    <ul className='relative z-[100] bg-[#0C1014] rounded-[12px] border-[1px]  border-regaliaPurple'>
      <li
        onClick={() => {
          setDropdownVisible(false);
          router.push('/profile?tab=broadcast');
        }}
        className='flex items-center gap-[10px] px-4 py-3 hover:opacity-50 cursor-pointer border-b border-regaliaPurple last:border-none'
      >
        <IconProfile className='w-6 h-6' />
        <span>User</span>
      </li>
      <li
        onClick={() => {
          setDropdownVisible(false);
          router.push('/profile');
        }}
        className='flex items-center gap-[10px] px-4 py-3 hover:opacity-50 cursor-pointer border-b border-regaliaPurple last:border-none'
      >
        <IconSettings className='w-6 h-6' />
        <span>Settings</span>
      </li>
      <li
        onClick={() => {
          setDropdownVisible(false);
          logOut();
        }}
        className='flex items-center gap-[10px] px-4 py-3 hover:opacity-50 cursor-pointer'
      >
        <IconLogout className='w-6 h-6' />
        <span>Log out</span>
      </li>
    </ul>
  );
};

export default DropDownNav;
