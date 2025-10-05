import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

interface MenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface MenuProps {
  menuList: MenuItem[];
}

const Menu: FC<MenuProps> = ({ menuList }) => {
  const pathname = usePathname();
  return (
    <div className='w-full pr-[30px]'>
      {menuList.map((item, i) => (
        <Link
          key={i}
          href={item.disabled ? '#' : item.href}
          className={clsx({
            'opacity-40 pointer-events-none': item.disabled,
          })}
        >
          <div
            className={clsx(
              'min-w-[190px] flex group items-center gap-[10px] p-3 rounded-[12px] cursor-pointer hover:bg-blackedGray data-[selected=true]:bg-blackedGray',
              {
                'cursor-not-allowed': item.disabled,
              },
            )}
            data-selected={pathname === item.href}
          >
            <div className='w-6 h-6 [&_*]:stroke-webGray group-hover:[&_*]:stroke-white group-data-[selected=true]:[&_*]:stroke-white'>
              {item.icon}
            </div>
            <span className='text-[15px] font-extrabold text-webGray group-hover:text-white group-data-[selected=true]:text-white'>
              {item.label}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Menu;
