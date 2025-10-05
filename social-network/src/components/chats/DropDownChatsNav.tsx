import { FC } from 'react';

interface DropDownChatsNavProps {
  onClick: (action: 'chat' | 'group' | 'server' | 'addChat') => void;
}

const DropDownChatsNav: FC<DropDownChatsNavProps> = ({ onClick }) => {
  return (
    <ul className='absolute right-0 top-12 w-48 bg-[#2F3136] rounded-[12px] z-[1000]'>
      <li
        onClick={() => onClick('addChat')}
        className='flex items-center gap-[10px] px-4 py-3 hover:opacity-50 cursor-pointer border-b border-[rgba(255,255,255,0.16)] last:border-none'
      >
        Invite members
      </li>
      <li
        onClick={() => onClick('group')}
        className='flex items-center gap-[10px] px-4 py-3 hove
        r:opacity-50 cursor-pointer border-b border-[rgba(255,255,255,0.16)] last:border-none'
      >
        Share invite links
      </li>
    </ul>
  );
};

export default DropDownChatsNav;
