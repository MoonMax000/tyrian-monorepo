import type { BreadcrumbsItem, ResolvedSegment } from '../model/types';

export const getPathSegments = (
  url: string,
  resolvedSegments: ResolvedSegment[],
): BreadcrumbsItem[] => {
  const segments = url.split('/').filter(Boolean);

  const items: BreadcrumbsItem[] = [{ label: 'Home', href: '/' }];

  let currentPath = '';

  for (const segment of segments) {
    const resolvedSegment = resolvedSegments.find(({ pathTo }) => pathTo === segment);

    const label = resolvedSegment ? resolvedSegment.map(segment) : segment;

    currentPath += `/${segment}`;

    items.push({ label, href: currentPath });
  }

  return items;
};
