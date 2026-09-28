export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ width = "100%", height = "1rem" }: SkeletonProps) {
  return <div data-component="skeleton" style={{ width, height }} />;
}
