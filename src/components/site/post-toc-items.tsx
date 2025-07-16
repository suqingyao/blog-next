'use client';

import type { Result as TocResult } from 'mdast-util-toc';
import { useEffect, useRef, useState } from 'react';
import { scrollTo } from '@/lib/utils';
import { APP_HEADER_HEIGHT } from '@/constants';
import { throttle } from '@/lib/throttle';
import { useMount } from '@/hooks/use-mount';

interface ItemsProps {
  items: TocResult['map'];
  activeId?: string;
  prefix?: string;
  setActiveId?: (id: string) => void;
}

function getIds(items: TocResult['map']) {
  return (
    items?.children?.reduce((acc: string[], item) => {
      item.children.forEach((child) => {
        if (child.type === 'paragraph' && (child.children[0] as any).url) {
          acc.push((child.children[0] as any).url.slice(1));
        }
        // else if (child.type === 'list') {
        //   acc.push(...getIds(child));
        // }
      });
      return acc;
    }, []) || []
  );
}

function getElement(id: string) {
  return document.querySelector(`#user-content-${id}`);
}

function useActiveId(itemIds: string[]) {
  const [activeId, setActiveId] = useState<string>('');

  const handleScroll = throttle((e: Event) => {
    const scrollBottom =
      window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
    if (scrollBottom) {
      setActiveId(itemIds[itemIds.length - 1]);
      return;
    }
    for (let i = itemIds.length - 1; i >= 0; i--) {
      const el = getElement(itemIds[i]);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= APP_HEADER_HEIGHT) {
          setActiveId(itemIds[i]);
          scrollTo(itemIds[i], false, APP_HEADER_HEIGHT);
          return;
        }
      }
    }
    setActiveId(itemIds[0]);
    scrollTo(itemIds[0], false, APP_HEADER_HEIGHT);
  }, 100);

  useMount(() => {
    handleScroll(new Event('scroll'));
  });

  useEffect(() => {
    if (!itemIds.length) return;

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return [activeId, setActiveId] as const;
}

function Items(props: ItemsProps) {
  const { items, activeId, prefix = '', setActiveId } = props;
  const [maxWidth, setMaxWidth] = useState(0);
  const anchorRef = useRef<HTMLLIElement>(null);
  useEffect(() => {
    const handler = () => {
      if (!anchorRef.current) return;
      const $anchor = anchorRef.current;
      const pos = $anchor.getBoundingClientRect();
      const maxWidth = window.innerWidth - pos.x - 20;
      setMaxWidth(maxWidth);
    };

    handler();
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('resize', handler);
    };
  }, []);
  return (
    <ol className={prefix ? 'pl-5' : ''}>
      <li ref={anchorRef} />
      {maxWidth > 0 &&
        items?.children?.map((item, index) => (
          <li
            key={index}
            style={{
              maxWidth: maxWidth + 'px'
            }}
          >
            {item.children.map((child: any, i) => {
              const content = `${prefix} ${child.content}`;

              return (
                <span key={index + '-' + i}>
                  {child.type === 'paragraph' && child.children?.[0]?.url && (
                    <span
                      data-url={child.children[0].url}
                      onClick={() => {
                        scrollTo(
                          child.children[0].url,
                          false,
                          APP_HEADER_HEIGHT
                        );
                        setActiveId?.(child.children[0].url.slice(1));
                      }}
                      title={content}
                      className={
                        (`#${activeId}` === child.children[0].url
                          ? 'font-bold text-accent'
                          : 'font-medium text-zinc-400') +
                        ' inline-block max-w-full cursor-pointer truncate align-bottom hover:text-accent'
                      }
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: content
                        }}
                      />
                    </span>
                  )}
                  {/* {child.type === 'list' && (
                    <Items
                      items={child}
                      activeId={activeId}
                      prefix={`${prefix}`}
                      setActiveId={setActiveId}
                    />
                  )} */}
                </span>
              );
            })}
          </li>
        ))}
    </ol>
  );
}

function PostTocItems(props: ItemsProps) {
  const { items } = props;
  const idList = getIds(items);
  const [activeId, setActiveId] = useActiveId(idList);

  return (
    <Items
      items={items}
      activeId={activeId}
      setActiveId={setActiveId}
    />
  );
}

export default PostTocItems;
