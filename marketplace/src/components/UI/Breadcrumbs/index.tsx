'use client';

import { type FC } from 'react';
import { usePathname } from 'next/navigation';
import type { ResolvedSegment } from './model/types';
import { getPathSegments } from './lib/get-path-segments';
import BreadcrumbsBase from './Base';

interface IBreadcrumbsProps {
  withHomePage?: boolean;
  resolvedSegments?: ResolvedSegment[];
  filterSegments?: (segment: string) => boolean;
  className?: string;
}

const Breadcrumbs: FC<IBreadcrumbsProps> = ({
  resolvedSegments = [],
  withHomePage = true,
  filterSegments,
  className,
}) => {
  const pathname = usePathname();

  const breadcrumbItems = getPathSegments(pathname, resolvedSegments, withHomePage, filterSegments);

  return <BreadcrumbsBase className={className} breadcrumbItems={breadcrumbItems} />;
};

export default Breadcrumbs;
