'use client';

import { Fragment, type FC } from 'react';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ChevronRight from '@/assets/icons/chevron-right.svg';
import type { ResolvedSegment } from '../model';
import { getPathSegments } from '../lib';

interface IBreadcrumbsProps {
  resolvedSegments?: ResolvedSegment[];
  className?: string;
}

export const Breadcrumbs: FC<IBreadcrumbsProps> = ({ resolvedSegments = [], className }) => {
  const pathname = usePathname();

  const breadcrumbItems = getPathSegments(pathname, resolvedSegments);

  return (
    <nav className={className}>
      <ul className='flex items-center'>
        {breadcrumbItems.map(({ href, label }, index) => (
          <Fragment key={href}>
            <li
              className={clsx('pr-2 last:pr-0 uppercase text-[15px] font-bold text-grayLight', {
                'text-opacity-10': index === breadcrumbItems.length - 1,
              })}
            >
              {index === breadcrumbItems.length - 1 ? (
                label
              ) : (
                <Link className='hover:text-white' href={href}>
                  {label}
                </Link>
              )}
            </li>
            {index < breadcrumbItems.length - 1 && (
              <li className='pr-2 last:pr-0'>
                <ChevronRight />
              </li>
            )}
          </Fragment>
        ))}
      </ul>
    </nav>
  );
};
