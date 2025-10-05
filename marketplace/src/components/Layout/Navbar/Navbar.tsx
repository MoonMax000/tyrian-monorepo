'use client';
import React, { useState, useCallback } from 'react';
import OpenNavbarButton from '@/assets/Navbar/OpenNavbarButton.svg';
import { cn } from '@/utils/cn';
import { NavbarProps } from './navbarTypes';
import { NavList } from './NavList';
import { navItemsList } from './navItemsList';

const Navbar: React.FC<NavbarProps> = ({ variant = 'primal', className }) => {
  const navItems = navItemsList[variant] || [];
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [active, setActive] = useState<string | null>(null);
  const [navbarOpen, setNavbarOpen] = useState(true);

  const toggle = useCallback((id: string) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleClick = useCallback((id: string) => {
    setActive(id);
  }, []);

  return (
    <nav
      className={cn(
        'bg-gray-900 min-h-full w-[244px] border-r-2 border-[#523A83] pl-6 pt-6 transition-transform duration-200 relative z-40 top-0 lg:w-[244px] md:w-64 sm:w-full',
        navbarOpen ? 'translate-x-0' : '-translate-x-[170px]',
        className,
      )}
      role='navigation'
      aria-label='Main navigation'
    >
      <button
        className={cn(
          'absolute right-[-13px] top-4 z-50 flex h-[26px] w-[26px] items-center justify-center rounded-[8px] border border-[#523A83] bg-[#0B0E11] p-0 text-[#B0B0B0] transition hover:bg-[#181B20]',
        )}
        onClick={() => setNavbarOpen((prev) => !prev)}
        aria-label={navbarOpen ? 'Закрыть навигацию' : 'Открыть навигацию'}
        aria-expanded={navbarOpen}
      >
        <OpenNavbarButton
          className={cn('transition-transform duration-200', !navbarOpen && 'rotate-180')}
        />
      </button>
      {navbarOpen && navItems.length > 0 && (
        <NavList
          items={navItems}
          depth={0}
          active={active}
          open={open}
          onClick={handleClick}
          onToggle={toggle}
        />
      )}
    </nav>
  );
};

export default Navbar;
