'use client';

import Tag from '@/components/Tag';
import Image from '@/components/UI/Image';
import clsx from 'clsx';
import { FC, useState, useRef, useEffect } from 'react';
import DropDownNav from '../AuthorizationModal/DropDownNav';
import { removeCookie } from '@/utilts/cookie';
import { useRouter } from 'next/navigation';
import { UserResponse } from '@/store/socialWebApi';
import Cookies from 'js-cookie';
import { TPostType } from '@/store/api';
import { SESSION_ID_COOKIE_NAME } from '@/constants/cookies';
import { useGetUserByEmailQuery } from '@/store/authApi';
import { getMediaUrl } from '@/helpers/getMediaUrl';

interface IClasses {
  date?: string;
}

interface ProfileProps {
  type?: TPostType;
  date?: string;
  classes?: IClasses;
  onClickAvatar?: () => void;
  onLogout?: () => void;
  user?: UserResponse | null;
  email?: string;
  mock?: boolean;
  enableDropdown?: boolean;
  onClick?: () => void;
  user_name?: string;
  avatar?: string;
  userEmail?: string;
}

const Profile: FC<ProfileProps> = ({
  type,
  date,
  classes,
  onClickAvatar,
  onLogout,
  mock = false,
  enableDropdown = false,
  onClick,
  userEmail,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { data: userData } = useGetUserByEmailQuery(userEmail ?? '');

  const handleLogout = () => {
    removeCookie(SESSION_ID_COOKIE_NAME);
    Cookies.remove(SESSION_ID_COOKIE_NAME);
    router.push('/');
    if (onLogout) {
      onLogout();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div
      ref={dropdownRef}
      className={clsx('relative flex items-center', {
        'gap-2': !enableDropdown,
      })}
    >
      <div
        onClick={(e) => {
          if (enableDropdown) {
            e.stopPropagation();
            setIsDropdownOpen((prev) => !prev);
          } else if (onClickAvatar) {
            onClickAvatar();
          } else if (onClick) {
            onClick();
          }
        }}
        className='min-w-12 cursor-pointer'
      >
        <Image
          width={44}
          height={44}
          src={userData?.avatar ? getMediaUrl(userData.avatar) ?? '' : '/mock-avatar-header.jpg'}
          alt='profile-logo'
          className={clsx(
            'rounded-full size-[44px] hover:cursor-pointer object-cover',
            enableDropdown ? 'cursor-pointer' : 'cursor-default',
          )}
        />
      </div>

      {isDropdownOpen && enableDropdown && (
        <DropDownNav
          onClick={(action: string) => {
            setIsDropdownOpen(false);
            if (action === 'profile' && onClickAvatar) {
              onClickAvatar();
            } else if (action === 'logout') {
              handleLogout();
            }
          }}
        />
      )}

      <div onClick={onClick} className='cursor-pointer'>
        {mock ? null : (
          <span className='text-base font-semibold leading-[21.82px]'>
            {userData?.username || 'John Smith'}
          </span>
        )}
        <div className='flex items-center gap-2'>
          {type && <Tag type={type} />}
          {date && (
            <span className={clsx('text-[12px] font-bold opacity-[0.48]', classes?.date)}>
              {date}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
