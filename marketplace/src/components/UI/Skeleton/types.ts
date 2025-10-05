type BaseSkeletonProps = {
  className?: string;
};

type SkeletonRectangleProps = {
  variant: 'rectangle';
  width?: string | number;
  height?: string | number;
};

type SkeletonCircleProps = {
  variant: 'circle';
  size?: string | number;
};

type SkeletonTextProps = {
  variant: 'text';
  fontSize?: string | number;
};

export type SkeletonProps = BaseSkeletonProps &
  (SkeletonCircleProps | SkeletonTextProps | SkeletonRectangleProps);
