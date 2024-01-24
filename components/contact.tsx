'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { IconType } from 'react-icons';

import { FaXTwitter, FaGithub } from 'react-icons/fa6';
import { IoLogoWechat, IoMail } from 'react-icons/io5';

type LinkText = {
  text: string;
  icon: IconType;
  href?: string;
};

export const Contact = () => {
  const linkText: LinkText[] = [
    {
      text: 'https://twitter.com/cully_fung',
      href: 'https://twitter.com/cully_fung',
      icon: (props) => <FaXTwitter {...props} />
    },
    {
      text: 'https://github.com/cullyfung',
      href: 'https://github.com/cullyfung',
      icon: (props) => <FaGithub {...props} />
    },
    {
      text: 'cullyfung',
      icon: (props) => <IoLogoWechat {...props} />
    },
    {
      text: 'cullyfung@gmail.com',
      icon: (props) => <IoMail {...props} />
    }
  ];

  return (
    <motion.ul
      initial="initial"
      animate="animate"
      variants={{
        initial: {
          transition: {
            when: 'afterChildren'
          }
        },
        animate: {
          transition: {
            when: 'beforeChildren',
            staggerChildren: 0.3,
            transition: {
              ease: 'easeInOut'
            }
          }
        }
      }}
      className="flex flex-col gap-5"
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
          <Icon size={24} />
          {href ? (
            <Link
              href={href}
              target="_blank"
              className="text-link ml-2"
            >
              {text}
            </Link>
          ) : (
            <span className="text-link ml-2">{text}</span>
          )}
        </motion.li>
      ))}
    </motion.ul>
  );
};
