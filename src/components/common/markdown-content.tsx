'use client';

import type { Result as TocResult } from 'mdast-util-toc';
import type { BundledTheme } from 'shiki/themes';
import { memo, type MutableRefObject } from 'react';

import PostToc from '@/components/site/post-toc';
import { cn } from '@/lib/utils';
import { renderMarkdown } from '@/markdown';

import { MarkdownContentContainer } from './markdown-content-container';

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
