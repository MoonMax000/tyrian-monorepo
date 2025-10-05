import type { BreadcrumbsItem, ResolvedSegment } from '../model/types';

export const getPathSegments = (
  url: string,
  resolvedSegments: ResolvedSegment[],
  withHomePage = true,
  filterSegments?: (segment: string) => boolean,
): BreadcrumbsItem[] => {
  const segments = url.split('/').filter(Boolean);

  const items: BreadcrumbsItem[] = [];

  if (withHomePage) {
    items.push({ label: 'Home', href: '/' });
  }

  let currentPath = '';

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];

    const resolvedSegment = resolvedSegments.find((s) => {
      const isStaticSegment = 'pathTo' in s;
      return isStaticSegment
        ? s.pathTo === segment
        : s.pattern({ segment, index: i, isFirst: i === 0, isLast: i === segments.length - 1 });
    });

    let label = segment;

    if (resolvedSegment) {
      if ('label' in resolvedSegment) {
        label = resolvedSegment.label;
      } else {
        label = resolvedSegment.map(segment);
      }
    }

    currentPath += `/${segment}`;

    const isValidSegment = filterSegments?.(segment) ?? true;

    if (!isValidSegment) continue;

    items.push({ label, href: currentPath });
  }

  return items;
};
