'use client';
import React, { useEffect, useState } from 'react';
import ArrowButton from '@/assets/Navbar/ArrowButton.svg';
import OpenNavbarButton from '@/assets/Navbar/OpenNavbarButton.svg';
import { LayoutVariant } from '../AppBackground/AppBackGround';
import { navItemsList } from './navItemsList';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utilts/cn';

export type NavItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  children?: NavItem[];
}

type NavbarProps = {
  variant: LayoutVariant;
};

const Navbar: React.FC<NavbarProps> = ({ variant }) => {
  const navItems = navItemsList[variant];
  const [open, setOpen] = useState<{ [key: string]: boolean }>(
    variant === 'secondary' ? { '0': true } : {}
  );
  const [active, setActive] = useState<string | null>(null);
  const [navbarOpen, setNavbarOpen] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    function findActiveItem(items: NavItem[]): string | null {
      for (const item of items) {
        if (item.href && pathname.startsWith(item.href)) {
          return item.id;
        }
        if (item.children) {
          const childActive = findActiveItem(item.children);
          if (childActive) return childActive;
        }
      }
      return null;
    }

    const found = findActiveItem(navItems);
    if (found) setActive(found);
  }, [pathname, navItems]);

  const toggle = (id: string) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleClick = (id: string, hasChildren: boolean) => {
    setActive(id);
    if (hasChildren) {
      if (variant === 'secondary' && id === '0') return;
      toggle(id);
    }
  };

  const renderItems = (items: NavItem[], depth = 0, parentId?: string) => (
    <ul
      className={cn(
        variant === "secondary" && parentId === "0" && depth === 1
          ? "relative before:absolute before:left-[14px] before:top-0 before:bottom-0 before:w-[1px] before:bg-[#523A83]/50 ml-2"
          : "",
        depth === 1 && parentId === "8" ? "mt-4" : "",
      )}>
      {items.map((item) => {
        const isActive = active === item.id;
        const isProducts = item.label === 'PRODUCTS';
        return (
          <React.Fragment key={item.id}>
            {isProducts && (
              <li className='my-4'>
                <hr className='border-t-2 border-[#523A83]' />
              </li>
            )}
            <li
              className={cn(
                "mb-2",
                depth > 0 ? "pl-2" : "",
                isProducts && depth === 0 && variant === "secondary" ? "-ml-4" : "",
              )}
            >
              {item.id === '0' && item.href && item.children ? (
                <div className="flex items-center w-full">
                  <Link
                    href={item.href}
                    className={`flex-1 flex items-center text-left px-4 py-2 rounded hover:bg-gray-700 transition
                  ${isActive
                        ? 'font-bold text-[15px] text-white'
                        : 'font-bold text-[15px] text-lighterAluminum'}
                  `}
                    onClick={() => setActive(item.id)}
                  >
                    {item.icon && <span className='mr-2'>{item.icon}</span>}
                    {item.label}
                  </Link>
                  <button
                    className="mr-8 flex items-center"
                    onClick={e => {
                      e.stopPropagation();
                      toggle(item.id);
                    }}
                  >
                    <ArrowButton className={`transition-transform duration-200 ${open[item.id] ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              ) : item.href && !item.children ? (
                <Link
                  href={item.href}
                  className={cn('flex items-center w-full text-left px-4 py-2 rounded hover:bg-gray-700 transition',
                    {
                      'font-bold text-[15px] uppercase text-lighterAluminum': isProducts,
                      'font-bold text-[15px] text-white': isActive && !isProducts,
                      'font-bold text-[15px] text-lighterAluminum': !isActive && !isProducts,
                    }
                  )}
                  onClick={() => setActive(item.id)}
                >
                  {item.icon && <span className='mr-2'>{item.icon}</span>}
                  {item.label}
                </Link>
              ) : (
                <button
                  className={cn('flex items-center w-full text-left px-4 py-2 rounded hover:bg-gray-700 transition',
                    {
                      'font-bold text-[15px] uppercase text-lighterAluminum': isProducts,
                      'font-bold text-[15px] text-white': isActive && !isProducts,
                      'font-bold text-[15px] text-lighterAluminum': !isActive && !isProducts,
                    }
                  )}
                  onClick={() => handleClick(item.id, !!item.children)}
                >
                  {item.icon && <span className='mr-2'>{item.icon}</span>}
                  {item.label}
                  {item.children && (
                    <span className='ml-auto flex items-center'>
                      <ArrowButton
                        className={`transition-transform duration-200 ${open[item.id] ? 'rotate-180' : ''}`}
                      />
                    </span>
                  )}
                </button>
              )}
              {item.children && open[item.id] && renderItems(item.children, depth + 1, item.id)}
            </li>
          </React.Fragment>
        );
      })}
    </ul>
  );

  return (
    <nav
      className={`min-h-screen bg-gray-900 min-h-full w-[244px] pl-[24px] pt-[24px] border-r-[3px] border-r-[#523a83] transition-transform duration-200 relative top-0 left-0 z-40
            ${navbarOpen ? 'translate-x-0' : '-translate-x-[222px]'}`}
    >
      <button
        className='absolute top-6 right-[-22px] z-50 w-[44px] h-[44px] rounded-[8px] bg-[#0B0E11] border border-[#523A83]
                  p-0 flex items-center justify-center text-[#B0B0B0] transition hover:bg-[#181B20]'
        onClick={() => setNavbarOpen((prev) => !prev)}
        style={{ boxShadow: '0 0 8px rgba(82,58,131,0.1)' }}
      >
        <OpenNavbarButton
          className={`transition-transform duration-200 ${navbarOpen ? '' : 'rotate-180'}`}
        />
      </button>
      {renderItems(navItems)}
    </nav>
  );
};

export default Navbar;
