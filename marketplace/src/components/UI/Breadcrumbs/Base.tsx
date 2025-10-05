'use client';

import { Fragment, type FC } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import type { BreadcrumbsItem } from './model/types';

interface IBreadcrumbsProps {
  className?: string;
  breadcrumbItems?: BreadcrumbsItem[];
}

const BreadcrumbsBase: FC<IBreadcrumbsProps> = ({
  className,
  breadcrumbItems = [],
}) => {
  return (
    <nav className={className}>
      <ul className='flex items-center gap-x-2 '>
        {breadcrumbItems.map(({ href, label }, index) => (
          <Fragment key={href}>
            <li
              className={clsx('text-[15px] font-medium text-lighterAluminum', {
                'text-white': index === breadcrumbItems.length - 1,
                'text-lighterAluminum': index !== breadcrumbItems.length - 1,
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
              <li className='text-[15px] font-medium text-lighterAluminum'>/</li>
            )}
          </Fragment>
        ))}
      </ul>
    </nav>
  );
};

export default BreadcrumbsBase;
