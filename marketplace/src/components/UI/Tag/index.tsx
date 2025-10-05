import { cn } from '@/utils/cn';
import { FC } from 'react';
import { Props, TRole } from './types';

const roles: Record<TRole, string> = {
  position_held: 'position held',
};

const roleColors: Record<TRole, string> = {
  position_held: 'text-[#FFA800] bg-[#3E321D]',
};

const RoleTag: FC<Props> = ({ role, className }) => {
  return (
    <div
      className={cn('px-1 text-xs font-extrabold w-fit rounded-[4px]', roleColors[role], className)}
    >
      {roles[role]}
    </div>
  );
};

export default RoleTag;
