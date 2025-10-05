'use client';

import Image from '@/components/UI/Image';
import clsx from 'clsx';
import { FC } from 'react';

interface IClasses {
  date?: string;
}

interface ProfileProps {
  date?: string;
  classes?: IClasses;
  user_name?: string;
  avatar?: string;
}

const Profile: FC<ProfileProps> = ({ date, classes, user_name, avatar }) => {
  return (
    <div className="relative flex items-center gap-2">
      <div className="min-w-12">
        <Image
          src={avatar || '/avatar.jpeg'}
          alt="profile-logo"
          className="rounded-full size-[44px]"
        />
      </div>

      <div>
        <span className="text-base font-semibold leading-[21.82px]">
          {user_name || 'John Smith'}
        </span>
        <div className="flex items-center gap-2">
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
