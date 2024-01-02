'use client';

import { useRef } from 'react';
import type { FC, PropsWithChildren } from 'react';

import { useMount } from '@/hooks/useMount';
import { isArrayLike } from '@/utils/is';

export type SidebarProps = PropsWithChildren & {};

type Children = {
  type?: string;
  key?: string | null;
  ref?: HTMLElement | null;
  props?: {
    children?: Children[] | Children;
    className?: string;
  };
};

// function getAllAnchors(children: Children) {
//   const anchors: any[] = [];

//   function getAnchors(children: Children) {
//     if (isArrayLike(children?.props?.children)) {
//       Array.from(children?.props?.children as Children[]).forEach((child) => {
//         getAnchors(child);
//       });
//     } else if (typeof children.props?.children === 'object') {
//       getAnchors(children.props.children as Children);
//     } else if (children.type === 'a') {
//       anchors.push(children);
//     }
//   }

//   getAnchors(children);

//   return anchors;
// }

const Sidebar: FC<SidebarProps> = ({ children, ...props }) => {
  const tocAnchorsRef = useRef<HTMLAnchorElement[]>([]);
  const headingAnchorsRef = useRef<HTMLAnchorElement[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const inViewAnchorsRef = useRef(new Map<HTMLAnchorElement, boolean>());

  useMount(() => {
    tocAnchorsRef.current = Array.from(
      document.querySelectorAll('a.toc-link') as NodeListOf<HTMLAnchorElement>
    );

    headingAnchorsRef.current = Array.from(
      document.querySelectorAll('a.anchor') as NodeListOf<HTMLAnchorElement>
    );

    // reset inViewAnchorsRef
    headingAnchorsRef.current.forEach((anchor) => {
      inViewAnchorsRef.current.set(anchor, false);
    });

    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            inViewAnchorsRef.current.set(
              entry.target as HTMLAnchorElement,
              true
            );
          } else {
            inViewAnchorsRef.current.set(
              entry.target as HTMLAnchorElement,
              false
            );
          }
        });
        const inViewList = Array.from(inViewAnchorsRef.current);
        const inViewIndex = inViewList.findIndex(([_, inView]) => !!inView);

        if (inViewIndex !== -1) {
          requestAnimationFrame(() => {
            tocAnchorsRef.current.forEach((anchor, index) => {
              if (index === inViewIndex) {
                anchor.classList.remove('!opacity-40');
                anchor.classList.add('!opacity-100');
              } else {
                anchor.classList.remove('!opacity-100');
                anchor.classList.add('!opacity-40');
              }
            });
          });
        }
      });
    }

    headingAnchorsRef.current.forEach((anchor) => {
      observerRef.current?.observe(anchor);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  });

  useMount(() => {});

  useMount(() => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        let hashval = anchor.getAttribute('href') as string;
        let target = document.querySelector(hashval) as HTMLAnchorElement;
        let targetPos = target.getBoundingClientRect().top;
        let offsetPos = targetPos + scrollY - 60;
        event.preventDefault();
        window.scrollTo({
          top: offsetPos,
          behavior: 'smooth'
        });
      });
    });
  });

  return <nav {...props}>{children}</nav>;
};

export default Sidebar;
