'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ArrowButton from '@/assets/Navbar/ArrowButton.svg';
import OpenNavbarButton from '@/assets/Navbar/icon-double-arrow.svg';
import Markets from '@/assets/Navbar/Markets.svg';
import { navItemsList } from '@/components/UI/Navbar/navItemsList';
import { LayoutVariant } from '@/components/UI/AppBackground/AppBackGround';
import { cn } from '@/utilts/cn';

type Item = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  children?: Item[];
};

function NewNavBar({ variant }: { variant: LayoutVariant }) {
  const pathname = usePathname();

  const products = useMemo<Item[]>(() => {
    const list = navItemsList[variant] as unknown as Item[];
    const prod = list.find((i) => i.label === 'PRODUCTS');
    return prod?.children ?? [];
  }, [variant]);

  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [navbarOpen, setNavbarOpen] = useState(true);

  const toggle = (id: string) => setOpen((p) => ({ ...p, [id]: !p[id] }));
  const isActive = (href?: string) =>
    !!href && (pathname === href || pathname.startsWith(href));

  const renderChildren = (children?: Item[]) =>
    !children?.length ? null : (
      <ul className='ml-2 relative before:absolute before:left-[14px] before:top-0 before:bottom-0 before:w-[1px] before:bg-[#523A83]/50'>
        {children.map((child) => (
          <li key={child.id} className='mb-2 pl-2'>
            {child.href ? (
              <Link
                href={child.href}
                className={cn(
                  'flex items-center w-full text-left px-4 py-2 rounded hover:bg-gray-700 transition',
                  isActive(child.href)
                    ? 'font-bold text-[15px] text-white'
                    : 'font-bold text-[15px] text-lighterAluminum',
                )}
              >
                {child.icon && <span className='mr-2'>{child.icon}</span>}
                {child.label}
              </Link>
            ) : (
              <div className='flex items-center w-full text-left px-4 py-2 rounded hover:bg-gray-700 transition font-bold text-[15px] text-lighterAluminum'>
                {child.icon && <span className='mr-2'>{child.icon}</span>}
                {child.label}
              </div>
            )}
          </li>
        ))}
      </ul>
    );

  return (
    <div className='relative mt-8 ml-8'>
      <button
        className={cn(
          'absolute top-[21px] right-[-16px] z-50 p-2 container-card rounded-[8px] flex items-center justify-center text-[#B0B0B0] transition-all duration-[800ms] hover:bg-[#181B20]',
          !navbarOpen && 'transform -translate-x-[222px]',
        )}
        onClick={() => setNavbarOpen((prev) => !prev)}
        style={{ boxShadow: '0 0 8px rgba(82,58,131,0.1)' }}
        aria-label='Toggle menu'
        aria-expanded={navbarOpen}
      >
        <OpenNavbarButton
          className={cn(
            'transition-transform duration-[800ms]',
            !navbarOpen && 'rotate-180',
          )}
        />
      </button>

      <div
        className={cn(
          'container-card border-none flex flex-col h-fit gap-[28px] px-4 py-[24px] relative rounded-[12px] transition-all duration-[800ms]',
          navbarOpen
            ? 'translate-x-0 opacity-100 pointer-events-auto'
            : '-translate-x-[222px] opacity-0 pointer-events-none',
        )}
      >
        <div
          className='absolute inset-0 rounded-[12px] pointer-events-none w-[100.2%] h-[100.2%]'
          style={{
            padding: '1px',
            background:
              'linear-gradient(75deg, rgba(82,58,131,0) 0%, #523A83 50%, rgba(82,58,131,0) 100%)',
            WebkitMask:
              'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        <div className='flex items-center px-4 py-2'>
          <span className='mr-2'>
            <Markets />
          </span>
          <span className='font-bold text-[15px] text-lighterAluminum uppercase'>
            Home
          </span>
        </div>

        <div
          className='w-full h-[2px] rounded-full'
          style={{
            background:
              'linear-gradient(90deg, rgba(82,58,131,0) 0%, #523A83 50%, rgba(82,58,131,0) 100%)',
          }}
        />

        <ul className='flex flex-col gap-[28px]'>
          {products.map((item, idx) => {
            const hasChildren = (item.children?.length ?? 0) > 0;
            const opened = !!open[item.id];

            return (
              <li key={item.id}>
                <div className={cn('flex items-center')}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={cn(
                        'flex-1 flex items-center text-left px-4 rounded hover:bg-gray-700 transition',
                        isActive(item.href)
                          ? 'font-bold text-[15px] text-white'
                          : 'font-bold text-[15px] text-lighterAluminum',
                      )}
                    >
                      {item.icon && <span className='mr-2'>{item.icon}</span>}
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      type='button'
                      className='flex-1 flex items-center text-left px-4 rounded hover:bg-gray-700 transition font-bold text-[15px] text-lighterAluminum'
                    >
                      {item.icon && <span className='mr-2'>{item.icon}</span>}
                      {item.label}
                    </button>
                  )}

                  {/* {hasChildren && ( */}
                    <button
                      type='button'
                      className='mr-4 flex items-center'
                      onClick={(e) => {
                        e.stopPropagation();
                        toggle(item.id);
                      }}
                      aria-label='Toggle submenu'
                      aria-expanded={opened}
                    >
                      <ArrowButton
                        className={cn(
                          'transition-transform duration-200',
                          opened && 'rotate-180',
                        )}
                      />
                    </button>
                  {/* )} */}
                </div>

                {hasChildren && opened && renderChildren(item.children)}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default NewNavBar;
