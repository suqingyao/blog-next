'use client';

import type { ModalComponent } from '@/components/ui/modal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { Modal } from '@/components/ui/modal';
import { consoleLog } from '@/lib/console';

interface SearchResult {
  slug: string;
  title: string;
  summary: string;
  createdTime: string;
  tags?: string[];
  searchText: string;
}

const SearchModalInner: ModalComponent = ({ dismiss }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  /**
   * 重置搜索状态
   */
  const resetSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setSelectedIndex(0);
  }, []);

  /**
   * 执行搜索请求
   */
  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}&limit=8`,
      );
      const data = await response.json();
      setResults(data.results || []);
      setSelectedIndex(0);
    }
    catch (error) {
      consoleLog('ERROR', 'Search error:', error);
      setResults([]);
    }
    finally {
      setLoading(false);
    }
  }, []);

  /**
   * 防抖搜索效果
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      search(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, search]);

  /**
   * 键盘导航处理
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev =>
            prev < results.length - 1 ? prev + 1 : prev,
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            router.push(`/posts/${results[selectedIndex].slug}`);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [results, selectedIndex]);

  /**
   * 自动聚焦输入框
   */
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  /**
   * 滚动到选中项
   */
  useEffect(() => {
    if (resultsRef.current) {
      const selectedElement = resultsRef.current.children[
        selectedIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  }, [selectedIndex]);

  /**
   * 高亮匹配文本
   */
  const highlightText = (text: string, query: string) => {
    if (!query.trim())
      return text;

    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
      'gi',
    );
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part)
        ? (
            <mark
              key={`highlight-${index}-${part}`}
              className="bg-primary rounded px-1 dark:bg-zinc-600 dark:text-zinc-100"
            >
              {part}
            </mark>
          )
        : (
            <span key={`text-${index}-${part}`}>{part}</span>
          ),
    );
  };

  /**
   * 处理模态框关闭事件
   */
  const handleClose = useCallback(() => {
    resetSearch();
    dismiss();
  }, [dismiss, resetSearch]);

  return (
    <>
      {/* 搜索输入框 */}
      <div className="flex items-center border-b border-zinc-200 px-4 py-3 dark:border-zinc-600">
        <i className="i-mingcute-search-line mr-3 h-5 w-5 text-zinc-400 dark:text-zinc-500" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search articles..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-zinc-900 placeholder-zinc-500 outline-none dark:text-zinc-100 dark:placeholder-zinc-400"
          aria-label="Search articles"
        />
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </div>

      {/* 搜索结果 */}
      <div
        className="max-h-96 overflow-y-auto"
        ref={resultsRef}
        role="listbox"
        aria-label="Search results"
      >
        {loading
          ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-zinc-500 dark:border-zinc-400"></div>
                <span className="ml-2 text-zinc-500 dark:text-zinc-400">
                  Searching...
                </span>
              </div>
            )
          : results.length > 0
            ? (
                <div className="py-2">
                  {results.map((result, index) => (
                    <Link
                      key={result.slug}
                      href={`/posts/${result.slug}`}
                      className={`block px-4 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-700 ${
                        index === selectedIndex ? 'bg-zinc-50 dark:bg-zinc-700' : ''
                      }`}
                      onClick={handleClose}
                      role="option"
                      aria-selected={index === selectedIndex}
                    >
                      <div className="flex flex-col">
                        <h3 className="mb-1 font-medium text-zinc-900 dark:text-zinc-100">
                          {highlightText(result.title, query)}
                        </h3>
                        <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                          {highlightText(result.summary, query)}
                        </p>
                        <div className="mt-2 flex items-center text-xs text-zinc-500 dark:text-zinc-400">
                          <time>
                            {new Date(result.createdTime).toLocaleDateString('zh-CN')}
                          </time>
                          {result.tags && result.tags.length > 0 && (
                            <div className="ml-3 flex gap-1">
                              {result.tags.slice(0, 3).map((tag, tagIndex) => (
                                <span
                                  key={`${result.slug}-tag-${tagIndex}-${tag}`}
                                  className="rounded bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-700 dark:text-zinc-300"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )
            : query.trim()
              ? (
                  <div className="flex flex-col items-center justify-center py-8 text-zinc-500 dark:text-zinc-400">
                    <i className="i-mingcute-search-line mb-2 h-8 w-8" />
                    <p>No articles found</p>
                    <p className="mt-1 text-sm">Try different keywords</p>
                  </div>
                )
              : (
                  <div className="flex flex-col items-center justify-center py-8 text-zinc-500 dark:text-zinc-400">
                    <i className="i-mingcute-search-line mb-2 h-8 w-8" />
                    <p>Enter keywords to start searching</p>
                    <p className="mt-1 text-sm">Search by title, content, and tags</p>
                  </div>
                )}
      </div>

      {/* 快捷键提示 */}
      <div className="border-t border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-600 dark:bg-zinc-800">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <KbdGroup>
                <Kbd>
                  <i className="i-mingcute-arrow-up-line h-4 w-4" />
                </Kbd>
                <Kbd>
                  <i className="i-mingcute-arrow-down-line h-4 w-4" />
                </Kbd>
              </KbdGroup>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <Kbd>Enter</Kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <Kbd>Esc</Kbd>
              Close
            </span>
          </div>
          {/* Algolia Logo */}
          <div className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
            <span>Powered by</span>
            <i className="i-simple-icons-algolia h-4 w-auto" />
          </div>
        </div>
      </div>
    </>
  );
};

SearchModalInner.contentProps = {
  dismissOnOutsideClick: true,
};

export const SearchModal: ModalComponent = SearchModalInner;

export function openSearchModal() {
  Modal.present(SearchModal, undefined, { dismissOnOutsideClick: true });
}
