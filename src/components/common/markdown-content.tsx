'use client';

import type { Result as TocResult } from 'mdast-util-toc';
import type { BundledTheme } from 'shiki/themes';
import { memo, useEffect, type MutableRefObject } from 'react';

import PostToc from '@/components/site/post-toc';
import { cn, scrollTo } from '@/lib/utils';
import { renderMarkdown } from '@/markdown';
import { useClipboard } from '@/hooks/use-clipboard';

import { MarkdownContentContainer } from './markdown-content-container';
import { toast } from 'sonner';
import { APP_HEADER_HEIGHT } from '@/constants';

const MarkdownContent = memo(function PageContent({
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
  codeTheme
}: {
  content?: string;
  className?: string;
  withToc?: boolean;
  inputRef?: MutableRefObject<HTMLDivElement | null>;
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
}) {
  let inParsedContent;
  if (parsedContent) {
    inParsedContent = parsedContent;
  } else if (content) {
    inParsedContent = renderMarkdown({
      content,
      strictMode,
      codeTheme
    });
  }

  let toc: TocResult | undefined = undefined;
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
          handleCopy(codeWrapper as HTMLDivElement)
        );
    });

    return () => {
      codeWrappers.forEach((codeWrapper) => {
        codeWrapper
          .querySelector('.copy-button')
          ?.removeEventListener('click', () =>
            handleCopy(codeWrapper as HTMLDivElement)
          );
      });
    };
  }, [isSupported]);

  useEffect(() => {
    const anchors = document.querySelectorAll('.post-content .anchor');
    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      const target = (e.target as HTMLAnchorElement).getAttribute('href');
      if (target) {
        scrollTo(target, true, APP_HEADER_HEIGHT);
      }
    };
    anchors.forEach((anchor) => {
      anchor?.addEventListener('click', handleClick as EventListener);
    });

    return () => {
      anchors.forEach((anchor) => {
        anchor?.removeEventListener('click', handleClick as EventListener);
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
          className="post-content prose"
          ref={inputRef}
        >
          {inParsedContent?.toElement()}
        </div>
        {toc && <PostToc data={toc} />}
      </>
    </MarkdownContentContainer>
  );
});

export default MarkdownContent;
