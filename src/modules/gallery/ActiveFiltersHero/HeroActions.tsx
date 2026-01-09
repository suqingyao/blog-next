import { m as motion } from 'motion/react';
import { Spring } from '@/lib/spring';

interface HeroActionsProps {
  onClearAll: () => void;
  onEditFilters: () => void;
}

export function HeroActions({ onClearAll, onEditFilters }: HeroActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <motion.button
        type="button"
        onClick={onEditFilters}
        className="flex items-center gap-1.5 rounded-lg bg-transparent px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={Spring.presets.snappy}
      >
        <i className="i-lucide-pencil text-xs" />
        <span>编辑筛选</span>
      </motion.button>
      <motion.button
        type="button"
        onClick={onClearAll}
        className="flex items-center gap-1.5 rounded-lg bg-transparent px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={Spring.presets.snappy}
      >
        <i className="i-lucide-x text-xs" />
        <span>清除全部</span>
      </motion.button>
    </div>
  );
}
