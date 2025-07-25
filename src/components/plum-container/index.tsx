'use client';

import { useMemo, useRef } from 'react';
import { useRafFn } from '@/hooks/use-raf-fn';
import { useWindowSize } from '@/hooks/use-window-size';
import { useMount } from '@/hooks/use-mount';

export const PlumContainer = () => {
  const r180 = Math.PI;
  const r90 = Math.PI / 2;
  const r15 = Math.PI / 12;
  const color = '#88888825';
  const size = useWindowSize();
  const { random } = Math;

  const el = useRef<HTMLCanvasElement | null>(null);

  const start = useRef<Fn>(() => {});
  const init = useRef(4);
  const len = useRef(6);
  const stopped = useRef(false);

  const initCanvas = (
    canvas: HTMLCanvasElement,
    width = 400,
    height = 400,
    _dpi?: number
  ) => {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const bsr =
      // @ts-expect-error canvas.getContext('2d')
      ctx!.webkitBackingStorePixelRatio ||
      // @ts-expect-error canvas.getContext('2d')
      ctx!.mozBackingStorePixelRatio ||
      // @ts-expect-error canvas.getContext('2d')
      ctx!.msBackingStorePixelRatio ||
      // @ts-expect-error canvas.getContext('2d')
      ctx!.oBackingStorePixelRatio ||
      // @ts-expect-error canvas.getContext('2d')
      ctx!.backingStorePixelRatio ||
      1;
    const dpi = _dpi || dpr / bsr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = dpi * width;
    canvas.height = dpi * height;
    ctx!.scale(dpi, dpi);
    return { ctx, dpi };
  };

  const polar2cart = (x = 0, y = 0, r = 0, theta = 0) => {
    const dx = r * Math.cos(theta);
    const dy = r * Math.sin(theta);
    return [x + dx, y + dy];
  };

  let steps: Fn[] = [];
  let prevSteps: Fn[] = [];
  let iterations = 0;

  let lastTime = performance.now();
  const interval = 1000 / 40;
  let controls = useRafFn(() => {});
  const frame = () => {
    if (performance.now() - lastTime < interval) return;
    iterations += 1;
    prevSteps = steps;
    steps = [];
    lastTime = performance.now();
    if (!prevSteps.length) {
      controls.pause();
      stopped.current = true;
    }
    prevSteps.forEach((i) => i());
  };
  controls = useRafFn(frame);

  const fn = async () => {
    const canvas = el.current!;
    const { ctx } = initCanvas(canvas, size?.width, size?.height);
    const { width, height } = canvas;

    const step = (x: number, y: number, rad: number) => {
      const length = random() * len.current;
      const [nx, ny] = polar2cart(x, y, length, rad);
      // @ts-expect-error canvas.getContext('2d')
      ctx.beginPath();
      // @ts-expect-error canvas.getContext('2d')
      ctx.moveTo(x, y);
      // @ts-expect-error canvas.getContext('2d')
      ctx.lineTo(nx, ny);
      // @ts-expect-error canvas.getContext('2d')
      ctx.stroke();
      const rad1 = rad + random() * r15;
      const rad2 = rad - random() * r15;
      if (
        nx < -100 ||
        nx > (size?.width || 0) + 100 ||
        ny < -100 ||
        ny > (size?.height || 0) + 100
      )
        return;
      if (iterations <= init.current || random() > 0.5)
        steps.push(() => step(nx, ny, rad1));
      if (iterations <= init.current || random() > 0.5)
        steps.push(() => step(nx, ny, rad2));
    };
    start.current = () => {
      controls.pause();
      iterations = 0;
      ctx!.clearRect(0, 0, width, height);
      ctx!.lineWidth = 1;
      ctx!.strokeStyle = color;
      prevSteps = [];
      steps = [
        () => step(random() * (size?.width || 0), 0, r90),
        () => step(random() * (size?.width || 0), size?.height || 0, -r90),
        () => step(0, random() * (size?.height || 0), 0),
        () => step(size?.width || 0, random() * (size?.height || 0), r180)
      ];
      if ((size?.width || 0) < 500) steps = steps.slice(0, 2);
      controls.resume();
      stopped.current = false;
    };
    start.current();
  };

  useMount(fn);

  const mask = useMemo(() => 'radial-gradient(circle, transparent, black)', []);
  return (
    <div
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: -1, maskImage: `${mask}`, WebkitMaskImage: `${mask}` }}
    >
      <canvas
        ref={el}
        width="400"
        height="400"
      />
    </div>
  );
};
