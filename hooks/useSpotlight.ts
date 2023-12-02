import { MouseEvent, useMemo } from 'react';
import { useSpring } from 'framer-motion';

const useSpotlight = () => {
  const x = useSpring(0);
  const y = useSpring(0);
  const r = useSpring(0);

  const movement = ({ currentTarget, clientX, clientY }: MouseEvent) => {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set(clientX - left);
    y.set(clientY - top);
    r.set(Math.sqrt(width ** 2 + height ** 2) / 2.5);
  };

  return useMemo(() => [{ x, y, r }, movement] as const, []);
};

export default useSpotlight;
