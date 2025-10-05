'use client';

import React from 'react';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export interface TabLinksItem {
  label: string;
  href: string;
}

interface TabLinksProps {
  items: TabLinksItem[];
  className?: string;
  listClassName?: string;
  itemClassName?: string;
}

const TabLinks: React.FC<TabLinksProps> = ({ items, className, listClassName, itemClassName }) => {
  const pathname = usePathname();

  return (
    <nav className={clsx(className)}>
      <ul
        className={clsx(
          'flex items-center overflow-x-scroll md:overflow-hidden gap-x-1 px-1 py-2 border-[1px] rounded-2xl border-regaliaPurple',
          listClassName,
        )}
      >
        {items.map(({ label, href }) => (
          <li
            key={href}
            className={clsx(
              'px-4 py-2 text-[19px] font-bold text-gray-500 rounded-lg text-webGray',
              itemClassName,
              {
                'bg-regaliaPurple text-white': pathname.endsWith(href),
              },
            )}
          >
            <Link href={href}>{label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TabLinks;
