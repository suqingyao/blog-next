'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { IconType } from 'react-icons';

import { FaXTwitter, FaGithub } from 'react-icons/fa6';
import { IoMail } from 'react-icons/io5';

type LinkText = {
  text: string;
  icon: IconType;
  href: string;
};

export const AppContact = () => {
  const linkText: LinkText[] = [
    {
      text: 'https://twitter.com/cully_fung',
      href: 'https://twitter.com/cully_fung',
      icon: (props) => <FaXTwitter {...props} />
    },
    {
      text: 'https://github.com/suyungqing',
      href: 'https://github.com/suyungqing',
      icon: (props) => <FaGithub {...props} />
    },
    {
      text: 'suyungqing@gmail.com',
      href: 'mailto:suyungqing@gmail.com',
      icon: (props) => <IoMail {...props} />
    }
  ];

  return (
    <motion.ul
      initial="initial"
      animate="animate"
      variants={{
        initial: {
          // opacity: 0,
          y: 20,
          transition: {
            when: 'afterChildren'
          }
        },
        animate: {
          // opacity: 1,
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
      className="flex gap-5 py-5"
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
            <Icon size={24} />
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  );
};
