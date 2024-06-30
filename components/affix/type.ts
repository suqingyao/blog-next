import { throttleByRaf } from '@/components/_utils/throttleByRaf';

export interface AffixProps {
  style?: React.CSSProperties;
  className?: string;
  offsetTop?: number;
  offsetBottom?: number;
  affixStyle?: React.CSSProperties;
  affixClassName?: string;
  target?: () => HTMLElement | null | Window;
  targetContainer?: () => HTMLElement | null | Window;
  onChange?: (affixed: boolean) => void;
  children: React.ReactNode;
}

export interface AffixState {
  status: 'MEASURE_START' | 'MEASURE_DONE';
  isFixed: Boolean;
  affixStyle: React.CSSProperties;
  placeholderStyle: React.CSSProperties;
}

export interface AffixRef {
  updatePosition: ReturnType<typeof throttleByRaf>;
}
