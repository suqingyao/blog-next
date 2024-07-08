'use client';

import React from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import AnchorLink, { AnchorLinkBaseProps } from './anchor-link';
import { AffixProps } from '../affix/type';
import getScroll from '../_utils/getScroll';
import scrollTo from '../_utils/scrollTo';
import { cn } from '@/lib/utils';
import AnchorContext from './context';
import Affix from '../affix';

export interface AnchorLinkItemProps extends AnchorLinkBaseProps {
  key: React.Key;
  children?: AnchorLinkItemProps[];
}

export type AnchorContainer = HTMLElement | Window;

function getDefaultContainer() {
  return window;
}

function getOffsetTop(
  element: HTMLElement,
  container: AnchorContainer
): number {
  if (!element.getClientRects().length) {
    return 0;
  }

  const rect = element.getBoundingClientRect();

  if (rect.width || rect.height) {
    if (container === window) {
      return rect.top - element.ownerDocument!.documentElement!.clientTop;
    }
    return rect.top - (container as HTMLElement).getBoundingClientRect().top;
  }

  return rect.top;
}

const sharpMatcherRegex = /#([\S ]+)$/;

interface Section {
  link: string;
  top: number;
}

export interface AnchorProps {
  className?: string;
  rootClassName?: string;
  style?: React.CSSProperties;
  offsetTop?: number;
  bounds?: number;
  affix?: boolean | Omit<AffixProps, 'offsetTop' | 'target' | 'children'>;
  showInkInFixed?: boolean;
  getContainer?: () => AnchorContainer;
  /** Return customize highlight anchor */
  getCurrentAnchor?: (activeLink: string) => string;
  onClick?: (
    e: React.MouseEvent<HTMLElement>,
    link: { title: React.ReactNode; href: string }
  ) => void;
  /** Scroll to target offset value, if none, it's offsetTop prop value or 0. */
  targetOffset?: number;
  /** Listening event when scrolling change active link */
  onChange?: (currentActiveLink: string) => void;
  items: AnchorLinkItemProps[];
  direction?: AnchorDirection;
  replace?: boolean;
}
export interface AnchorState {
  activeLink: null | string;
}

export interface AnchorDefaultProps extends AnchorProps {
  prefixCls: string;
  affix: boolean;
  showInkInFixed: boolean;
  getContainer: () => AnchorContainer;
}

export type AnchorDirection = 'vertical' | 'horizontal';

export interface Anchor {
  registerLink: (link: string) => void;
  unregisterLink: (link: string) => void;
  activeLink: string | null;
  scrollTo: (link: string) => void;
  onClick?: (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    link: { title: React.ReactNode; href: string }
  ) => void;
  direction: AnchorDirection;
}

const Anchor = (props: AnchorProps) => {
  const {
    rootClassName,
    className,
    style,
    offsetTop,
    affix = true,
    showInkInFixed = false,
    items,
    direction: anchorDirection = 'vertical',
    bounds,
    targetOffset,
    onClick,
    onChange,
    getContainer,
    getCurrentAnchor,
    replace
  } = props;

  const [links, setLinks] = React.useState<string[]>([]);
  const [activeLink, setActiveLink] = React.useState<string | null>(null);
  const activeLinkRef = React.useRef<string | null>(activeLink);

  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const spanLinkNode = React.useRef<HTMLSpanElement>(null);
  const animating = React.useRef<boolean>(false);

  const getCurrentContainer = getContainer ?? getDefaultContainer;

  const dependencyListItem: React.DependencyList[number] =
    JSON.stringify(links);

  const registerLink = (link: string) => {
    if (!links.includes(link)) {
      setLinks((prev) => [...prev, link]);
    }
  };

  const unregisterLink = (link: string) => {
    if (links.includes(link)) {
      setLinks((prev) => prev.filter((i) => i !== link));
    }
  };

  const updateInk = () => {
    const linkNode = wrapperRef.current?.querySelector<HTMLElement>(
      '.anchor-link-title-active'
    );
    if (linkNode && spanLinkNode.current) {
      const { style: inkStyle } = spanLinkNode.current;
      const horizontalAnchor = anchorDirection === 'horizontal';
      inkStyle.top = horizontalAnchor
        ? ''
        : `${linkNode.offsetTop + linkNode.clientHeight / 2}px`;
      inkStyle.height = horizontalAnchor ? '' : `${linkNode.clientHeight}px`;
      inkStyle.left = horizontalAnchor ? `${linkNode.offsetLeft}px` : '';
      inkStyle.width = horizontalAnchor ? `${linkNode.clientWidth}px` : '';
      if (horizontalAnchor) {
        scrollIntoView(linkNode, {
          scrollMode: 'if-needed',
          block: 'nearest'
        });
      }
    }
  };

  const getInternalCurrentAnchor = (
    _links: string[],
    _offsetTop = 0,
    _bounds = 5
  ): string => {
    const linkSections: Section[] = [];
    const container = getCurrentContainer();
    _links.forEach((link) => {
      const sharpLinkMatch = sharpMatcherRegex.exec(link?.toString());
      if (!sharpLinkMatch) return;
      const target = document.getElementById(sharpLinkMatch[1]);
      if (target) {
        const top = getOffsetTop(target, container);
        if (top <= _offsetTop + _bounds) {
          linkSections.push({ link, top });
        }
      }
    });

    if (linkSections.length) {
      const maxSection = linkSections.reduce((prev, curr) =>
        curr.top > prev.top ? curr : prev
      );
      return maxSection.link;
    }
    return '';
  };

  const setCurrentActiveLink = (link: string) => {
    if (activeLinkRef.current === link) {
      return;
    }

    const newLink =
      typeof getCurrentAnchor === 'function' ? getCurrentAnchor(link) : link;
    setActiveLink(newLink);
    activeLinkRef.current = newLink;

    onChange?.(link);
  };

  const handleScroll = React.useCallback(() => {
    if (animating.current) {
      return;
    }
    const currentActiveLink = getInternalCurrentAnchor(
      links,
      targetOffset !== undefined ? targetOffset : offsetTop || 0,
      bounds
    );

    setCurrentActiveLink(currentActiveLink);
  }, [dependencyListItem, targetOffset, offsetTop]);

  const handleScrollTo = React.useCallback<(link: string) => void>(
    (link) => {
      setCurrentActiveLink(link);
      const sharpLinkMatch = sharpMatcherRegex.exec(link);
      if (!sharpLinkMatch) return;
      const targetElement = document.getElementById(sharpLinkMatch[1]);
      if (!targetElement) return;

      const container = getCurrentContainer();
      const scrollTop = getScroll(container);
      const eleOffsetTop = getOffsetTop(targetElement, container);
      let y = scrollTop + eleOffsetTop;
      y -= targetOffset !== undefined ? targetOffset : offsetTop || 0;
      animating.current = true;
      scrollTo(y, {
        getContainer: getCurrentContainer,
        callback() {
          animating.current = false;
        }
      });
    },
    [targetOffset, offsetTop]
  );

  const wrapperClass = cn(
    rootClassName,
    'anchor-wrapper',
    {
      'anchor-wrapper--horizontal': anchorDirection === 'horizontal'
    },
    className
  );

  const anchorClass = cn({
    'anchor-fixed': !affix && !showInkInFixed
  });

  const inkClass = cn('anchor-ink', { 'anchor-ink-visible': activeLink });

  const wrapperStyle: React.CSSProperties = {
    maxHeight: offsetTop ? `calc(100vh - ${offsetTop}px)` : '100vh',
    ...style
  };

  const createNestedLink = (options?: AnchorLinkItemProps[]) =>
    Array.isArray(options)
      ? options.map((item) => (
          <AnchorLink
            replace={replace}
            {...item}
            key={item.key}
          >
            {anchorDirection === 'vertical' &&
              item.children?.length &&
              createNestedLink(item.children)}
          </AnchorLink>
        ))
      : null;

  const anchorContent = (
    <div
      ref={wrapperRef}
      className={wrapperClass}
      style={wrapperStyle}
    >
      <div className={anchorClass}>
        <span
          className={inkClass}
          ref={spanLinkNode}
        />
        {createNestedLink(items)}
      </div>
    </div>
  );

  React.useEffect(() => {
    const scrollContainer = getCurrentContainer();
    handleScroll();
    scrollContainer?.addEventListener('scroll', handleScroll);

    return () => scrollContainer?.removeEventListener('scroll', handleScroll);
  }, [dependencyListItem]);

  React.useEffect(() => {
    if (typeof getCurrentAnchor === 'function') {
      setCurrentActiveLink(getCurrentAnchor(activeLinkRef.current || ''));
    }
  }, [getCurrentAnchor]);

  React.useEffect(() => {
    updateInk();
  }, [anchorDirection, getCurrentAnchor, dependencyListItem, activeLink]);

  const memoizedContextValue = React.useMemo(
    () => ({
      registerLink,
      unregisterLink,
      scrollTo: handleScrollTo,
      activeLink,
      onClick,
      direction: anchorDirection
    }),
    [activeLink, onClick, handleScrollTo, anchorDirection]
  );

  const affixProps = affix && typeof affix === 'object' ? affix : undefined;

  return (
    <AnchorContext.Provider value={memoizedContextValue}>
      {affix ? (
        <Affix
          offsetTop={offsetTop}
          target={getCurrentContainer}
          {...affixProps}
        >
          {anchorContent}
        </Affix>
      ) : (
        anchorContent
      )}
    </AnchorContext.Provider>
  );
};

export default Anchor;
