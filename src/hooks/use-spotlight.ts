import { MouseEvent, useCallback, useMemo } from 'react';
import { useMotionValue } from 'framer-motion';

export const useSpotlight = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const r = useMotionValue(0);

  const movement = useCallback(
    ({ currentTarget, clientX, clientY }: MouseEvent) => {
      const { left, top, width, height } =
        currentTarget.getBoundingClientRect();
      x.set(clientX - left);
      y.set(clientY - top);
      r.set(Math.sqrt(width ** 2 + height ** 2) / 2.5);
    },
    [r, x, y]
  );

  return useMemo(() => [{ x, y, r }, movement] as const, []);
};
