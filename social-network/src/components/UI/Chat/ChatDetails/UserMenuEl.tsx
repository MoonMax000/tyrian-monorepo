'use client';
import { useState, useRef } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { User } from '@/app/data';
import ProfileItem from './ProfileItem';
import { DropdownMenu, DropdownMenuItem } from '../DropdownMenu';
import AddAdminIcon from '@/assets/icons/chat/police-add.svg';
import RemoveAdminIcon from '@/assets/icons/chat/police-remove.svg';
import { X } from 'lucide-react';

interface UserMenuItemProps {
  user: User;
  adminIds: number[];
  toggleAdmin: (userId: number) => void;
}

const UserMenuItem = ({ user, adminIds, toggleAdmin }: UserMenuItemProps) => {
  const [userMenuState, setUserMenuState] = useState<{
    items: DropdownMenuItem[];
  } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setUserMenuState(null));

  const handleUserContextMenu = (e: React.MouseEvent, user: User) => {
    e.preventDefault();
    const isAdmin = adminIds.includes(user.id);

    setUserMenuState({
      items: [
        {
          name: isAdmin ? 'Demote from admin' : 'Promote to admin',
          icon: isAdmin ? <RemoveAdminIcon /> : <AddAdminIcon />,
          onClick: () => toggleAdmin(user.id),
        },
        {
          name: 'Remove from group',
          icon: <X />,
          onClick: () => console.log('Removed', user.name),
        },
      ],
    });
  };

  return (
    <div key={user.id} onContextMenu={(e) => handleUserContextMenu(e, user)} className='relative'>
      <ProfileItem user={user} />
      {userMenuState && (
        <div ref={menuRef} className='absolute z-50 top-0 right-0'>
          <DropdownMenu items={userMenuState.items} />
        </div>
      )}
    </div>
  );
};

export default UserMenuItem;
