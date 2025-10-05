import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

interface MenuItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  value?: string;
}

interface MenuProps {
  menuList: MenuItem[];
  onItemClick?: (item: MenuItem) => void;
  activeValue?: string;
}

const Menu: FC<MenuProps> = ({ menuList, onItemClick, activeValue }) => {
  const pathname = usePathname();

  return (
    <div className="max-w-[190px]">
      {menuList.map((item, i) => {
        const isTabActive = item.value && activeValue === item.value;
        const isRouteActive = item.href && pathname === item.href;
        const isActive = isTabActive || isRouteActive;

        const content = (
          <div
            onClick={() => {
              if (!item.disabled && onItemClick) {
                onItemClick(item);
              }
            }}
            className={clsx(
              'flex group items-center gap-3 px-3.5 py-3 rounded-[12px] cursor-pointer hover:bg-blackedGray data-[selected=true]:bg-blackedGray',
              {
                'cursor-not-allowed': item.disabled,
              }
            )}
            data-selected={isActive}
          >
            <div className="w-6 h-6 [&_*]:stroke-webGray group-hover:[&_*]:stroke-white group-data-[selected=true]:[&_*]:stroke-white">
              {item.icon}
            </div>
            <span className="text-body-15 text-webGray group-hover:text-white group-data-[selected=true]:text-white">
              {item.label}
            </span>
          </div>
        );

        return item.href && !item.disabled ? (
          <Link
            key={i}
            href={item.href}
            className={clsx({
              'opacity-40 pointer-events-none': item.disabled,
            })}
          >
            {content}
          </Link>
        ) : (
          <div
            key={i}
            className={clsx({
              'opacity-40 pointer-events-none': item.disabled,
            })}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
};

export default Menu;
