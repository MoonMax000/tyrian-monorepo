export interface BreadcrumbsItem {
  label: string;
  href: string;
}

export type ResolvedSegment = { pathTo: string; map: (param: string) => string };
