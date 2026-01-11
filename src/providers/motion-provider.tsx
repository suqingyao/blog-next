import { domMax, LazyMotion, MotionConfig } from 'motion/react';
import { Spring } from '@/lib/spring';

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domMax} strict key="framer">
      <MotionConfig transition={Spring.presets.smooth}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
