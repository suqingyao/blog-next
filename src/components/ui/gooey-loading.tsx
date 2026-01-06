'use client';

import { motion } from 'motion/react';

export function GooeyLoading() {
  return (
    <div className="relative flex h-40 w-40 items-center justify-center" style={{ filter: 'url(#goo-global)' }}>
      {/* 
        SVG Filter 定义 
        使用不同的 ID 避免潜在冲突
      */}
      <svg className="absolute h-0 w-0">
        <defs>
          <filter id="goo-global">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* 中心主核 */}
      <motion.div
        className="absolute h-12 w-12 rounded-full bg-primary"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      />

      {/* 环绕粒子 */}
      {[...Array(6)].map((_, index) => {
        const angle = (index / 6) * 360;
        return (
          <motion.div
            key={index}
            className="absolute h-10 w-10 rounded-full bg-primary"
            initial={{ x: 0, y: 0 }}
            animate={{
              x: [0, Math.cos((angle * Math.PI) / 180) * 60, Math.cos(((angle + 60) * Math.PI) / 180) * 60, 0],
              y: [0, Math.sin((angle * Math.PI) / 180) * 60, Math.sin(((angle + 60) * Math.PI) / 180) * 60, 0],
              scale: [1, 0.8, 0.8, 1],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              times: [0, 0.4, 0.6, 1],
              delay: index * 0.1,
            }}
          />
        );
      })}
    </div>
  );
}
