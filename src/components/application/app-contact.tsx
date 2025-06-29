'use client';

import { motion } from 'motion/react';
import Link from 'next/link';

import { XIcon, GitHubIcon, MailIcon, BilibiliIcon } from '@/components/icons';

type LinkText = {
  text: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
};

export const AppContact = () => {
  const linkText: LinkText[] = [
    {
      text: 'https://twitter.com/suqingyao333',
      href: 'https://twitter.com/suqingyao333',
      icon: XIcon
    },
    {
      text: 'https://github.com/suqingyao',
      href: 'https://github.com/suqingyao',
      icon: GitHubIcon
    },
    {
      text: 'suqingyao333@gmail.com',
      href: 'mailto:suqingyao333@gmail.com',
      icon: MailIcon
    },
    {
      text: 'Bilibili',
      href: 'https://space.bilibili.com/27022081',
      icon: BilibiliIcon
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
            transition: {
              ease: 'easeInOut'
            }
          }
        }
      }}
      className="flex gap-6 py-6"
    >
      {linkText.map(({ href, text, icon: Icon }, index) => (
        <motion.li
          key={index}
          variants={{
            initial: {
              opacity: 0
            },
            animate: {
              opacity: 1,
              transition: {
                ease: 'easeInOut',
                delay: index * 0.06
              }
            }
          }}
          className="flex items-center"
        >
          <Link
            href={href}
            target="_blank"
          >
            <Icon className="h-6 w-6" />
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  );
};
