import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/utilts/cn";
import ArrowButton from '@/assets/icons/navbar/ArrowButton.svg';
import { NavItemProps } from './navbarTypes';
import { NavList } from './NavList';

export const NavItem: React.FC<NavItemProps> = ({
  item,
  depth,
  active,
  open,
  onClick,
  onToggle,
}) => {
  const isActive = active === item.id;
  const isProducts = item.label === 'PRODUCTS';
  const hasChildren = !!item.children?.length;
  const isChats = item.label === 'Chats';
  const pathname = usePathname();
  const isActiveLink = item.href && pathname === item.href;

  const handleClick = () => {
    onClick(item.id, hasChildren);
    if (hasChildren) onToggle(item.id);
  };

  return (
    <>
      {isProducts && (
        <li className='my-4'>
          <hr className='border-t-2 border-[#523A83]' />
        </li>
      )}
      <li className={cn('mb-2')}>
        {item.href ? (
          <Link
            href={item.href}
            className={cn(
              'flex w-full items-center justify-between rounded px-4 py-2 text-left transition hover:bg-gray-700',
              isActiveLink
                ? 'font-bold text-[15px] text-white'
                : 'font-bold text-[15px] text-[#B0B0B0]'
            )}
          >
              <span className='flex items-center'>
              {item.icon && <span className='mr-2'>{item.icon}</span>}
              {item.label}
            </span>
            {isChats && (
              <span className="ml-3 inline-flex items-center px-[8px] py-[2px] rounded-[15px] bg-white text-black text-[12px] font-bold">
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <ArrowButton
                className={cn('transition-transform duration-200', open[item.id] && 'rotate-180')}
                aria-hidden='true'
              />
            )}
          </Link>
        ) : (
          <button
            className={cn(
              'flex w-full items-center justify-between rounded px-4 py-2 text-left transition hover:bg-gray-700',
              isProducts
                ? 'font-medium text-[15px] uppercase text-[#B0B0B0]'
                : isActive
                  ? 'font-bold text-[15px] text-white'
                  : 'font-bold text-[15px] text-[#B0B0B0]',
            )}
            onClick={handleClick}
            aria-expanded={hasChildren ? open[item.id] : undefined}
            aria-controls={hasChildren ? `sub-menu-${item.id}` : undefined}
          >
            <span className='flex items-center'>
              {item.icon && <span className='mr-2'>{item.icon}</span>}
              {item.label}
            </span>
            {isChats && (
              <span className="ml-3 inline-flex items-center px-[8px] py-[2px] rounded-[15px] bg-white text-black text-[12px] font-bold">
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <ArrowButton
                className={cn('transition-transform duration-200', open[item.id] && 'rotate-180')}
                aria-hidden='true'
              />
            )}
          </button>
        )}

        {item.children && open[item.id] && (
          <NavList
            items={item.children}
            depth={depth + 1}
            active={active}
            open={open}
            onClick={onClick}
            onToggle={onToggle}
          />
        )}
      </li>
    </>
  );
};