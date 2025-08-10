'use client';

import { useEffect } from 'react';

/**
 * 搜索快捷键Hook
 * 监听Cmd+K (Mac) 或 Ctrl+K (Windows/Linux) 快捷键
 */
export function useSearchHotkey(onOpen: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd+K (Mac) 或 Ctrl+K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        onOpen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onOpen]);
}
