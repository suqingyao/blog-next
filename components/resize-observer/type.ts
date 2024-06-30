export interface ResizeObserverProps {
  onResize?: (entries: ResizeObserverEntry[]) => void;
  children: React.ReactNode;
}
