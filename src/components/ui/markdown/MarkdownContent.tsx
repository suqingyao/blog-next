'use client';

import type { Result as TocResult } from 'mdast-util-toc';
import type { BundledTheme } from 'shiki/themes';
import { memo, useEffect } from 'react';

import { toast } from 'sonner';
import PostToc from '@/components/site/PostToc';
import { APP_HEADER_HEIGHT } from '@/constants';
import { useClipboard } from '@/hooks/use-clipboard';

import { cn, scrollToElement } from '@/lib/utils';
import { renderMarkdown } from '@/markdown';
import { MarkdownContentContainer } from './MarkdownContentContainer';

export const MarkdownContent = memo(({
  className,
  content,
  withToc,
  inputRef,
  onScroll,
  onMouseEnter,
  parsedContent,
  strictMode,
  withActions,
  onlyContent,
  codeTheme,
}: {
  content?: string;
  className?: string;
  withToc?: boolean;
  inputRef?: React.RefObject<HTMLDivElement> | null;
  onScroll?: (scrollTop: number) => void;
  onMouseEnter?: () => void;
  parsedContent?: ReturnType<typeof renderMarkdown>;
  strictMode?: boolean;
  withActions?: boolean;
  onlyContent?: boolean;
  codeTheme?: {
    light?: BundledTheme;
    dark?: BundledTheme;
  };
}) => {
  let inParsedContent;
  if (parsedContent) {
    inParsedContent = parsedContent;
  }
  else if (content) {
    inParsedContent = renderMarkdown({
      content,
      strictMode,
      codeTheme,
    });
  }

  let toc: TocResult | undefined;
  if (!onlyContent && withToc) {
    toc = inParsedContent?.toToc();
  }

  const { copy, isSupported } = useClipboard();

  useEffect(() => {
    if (!isSupported) {
      return;
    }

    const handleCopy = (wrapper: HTMLDivElement) => {
      const codeWrapper = wrapper.querySelector('code') as HTMLPreElement;
      copy(codeWrapper?.textContent ?? '').then(() => {
        toast.success('Copied to clipboard');
      });
    };

    const codeWrappers = document.querySelectorAll('.code-wrapper');
    codeWrappers.forEach((codeWrapper) => {
      codeWrapper
        .querySelector('.copy-button')
        ?.addEventListener('click', () =>
          handleCopy(codeWrapper as HTMLDivElement));
    });

    return () => {
      codeWrappers.forEach((codeWrapper) => {
        codeWrapper
          .querySelector('.copy-button')
          ?.removeEventListener('click', () =>
            handleCopy(codeWrapper as HTMLDivElement));
      });
    };
  }, [isSupported]);

  useEffect(() => {
    const anchors = document.querySelectorAll('.post-content .anchor');
    const handleClick = (e: Event, anchor: HTMLAnchorElement) => {
      e.preventDefault();
      const target = anchor.getAttribute('href');
      if (target) {
        scrollToElement(target, true, APP_HEADER_HEIGHT);
      }
    };
    anchors.forEach((anchor) => {
      anchor
        ?.querySelector('.icon-hashtag')
        ?.addEventListener('click', (e: Event) =>
          handleClick(e, anchor as HTMLAnchorElement));
    });

    return () => {
      anchors.forEach((anchor) => {
        anchor
          ?.querySelector('.icon-hashtag')
          ?.removeEventListener('click', (e: Event) =>
            handleClick(e, anchor as HTMLAnchorElement));
      });
    };
  }, []);

  return (
    <MarkdownContentContainer
      className={cn('relative', className)}
      onScroll={onScroll}
      onMouseEnter={onMouseEnter}
    >
      <>
        <div
          className="post-content prose dark:prose-invert"
          ref={inputRef}
        >
          {inParsedContent?.toElement()}
        </div>
        {toc && <PostToc data={toc} />}
      </>
    </MarkdownContentContainer>
  );
});
