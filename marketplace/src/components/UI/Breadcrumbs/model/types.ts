export interface BreadcrumbsItem {
  label: string;
  href: string;
}

type PatternParams = {
  segment: string;
  index: number;
  isFirst: boolean;
  isLast: boolean;
};

type ResolvedStaticSegment = { pathTo: string; label: string };

type ResolvedDynamicSegment = {
  pattern: (params: PatternParams) => boolean;
  map: (segment: string) => string;
};

export type ResolvedSegment = ResolvedDynamicSegment | ResolvedStaticSegment;
