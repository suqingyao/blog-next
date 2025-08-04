'use client';

import { motion } from 'motion/react';

import { SocialLink } from '../links';

type LinkText = {
  text: string;
  href: string;
};

export const AppContact = () => {
  const linkText: LinkText[] = [
    {
      text: 'https://twitter.com/suqingyao333',
      href: 'https://twitter.com/suqingyao333'
    },
    {
      text: 'https://github.com/suqingyao',
      href: 'https://github.com/suqingyao'
    },
    {
      text: 'suqingyao333@gmail.com',
      href: 'mailto:suqingyao333@gmail.com'
    },
    {
      text: 'Bilibili',
      href: 'https://space.bilibili.com/27022081'
    },
    {
      text: 'RSS',
      href: '/api/feed'
    }
  ];

  return (
    <motion.ul
      initial="initial"
      animate="animate"
      variants={{
        initial: {
          opacity: 0,
          y: 20,
          transition: {
            when: 'afterChildren'
          }
        },
        animate: {
          opacity: 1,
          y: 0,
          transition: {
            when: 'beforeChildren',
            staggerChildren: 0.3,
            ease: 'easeInOut'
          }
        }
      }}
      className="flex gap-6 py-6"
    >
      {linkText.map(({ href, text }) => (
        <SocialLink
          key={text}
          href={href}
        />
      ))}
    </motion.ul>
  );
};
