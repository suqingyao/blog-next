'use client';

import { useState } from 'react';
import Anchor from '@/components/anchor';
import { useMount } from '@/hooks/use-mount';
import { ClientOnly } from '../client-only';

export const TableOfContents = ({ children, toc, ...props }: any) => {
  const [items, setItems] = useState([]);

  useMount(() => {
    if (toc) {
      try {
        const itemList = JSON.parse(toc);
        setItems(itemList);
      } catch (error) {
        console.log(error);
      }
    }
  });

  return (
    <ClientOnly>
      <Anchor
        {...props}
        items={items}
        offsetTop={60}
        replace={true}
      ></Anchor>
    </ClientOnly>
  );
};
