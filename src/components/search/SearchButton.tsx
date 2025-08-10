'use client';

import { useState } from 'react';
import { useSearchHotkey } from '@/hooks/use-search-hotkey';
import { SearchModal } from './SearchModal';

export function SearchButton() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 注册全局快捷键
  useSearchHotkey(() => setIsSearchOpen(true));

  return (
    <>
      <button
        onClick={() => setIsSearchOpen(true)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        aria-label="搜索文章"
      >
        <i className="i-mingcute-search-line h-4 w-4" />
        <span className="hidden sm:inline">搜索</span>
        <kbd className="hidden items-center rounded border border-zinc-300 bg-zinc-100 px-2 py-1 font-mono text-xs sm:inline-flex dark:border-zinc-600 dark:bg-zinc-700">
          ⌘K
        </kbd>
      </button>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
