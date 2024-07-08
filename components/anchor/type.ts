export interface AnchorProps {
  className?: string | string[];
  style?: React.CSSProperties;
  animation?: boolean;
  direction?: 'horizontal' | 'vertical';
  scrollContainer?: string | HTMLElement | Window;
  boundary?: number | 'end' | 'start' | 'center' | 'nearest';
  hash?: boolean;
  affix?: boolean;
  affixStyle?: React.CSSProperties;
  offsetTop?: number;
  offsetBottom?: number;
  onChange?: (newLink: string, oldLink: string) => void;
  onSelect?: (newLink: string, oldLink: string) => void;
  lineless?: boolean;
  targetOffset?: number;
}

export interface AnchorLinkProps {
  className?: string | string[];
  style?: React.CSSProperties;
  href?: string;
  title?: string | React.ReactNode;
}
