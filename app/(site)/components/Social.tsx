import Link from 'next/link';
import React from 'react';

import { IoLogoTwitter, IoLogoGithub } from 'react-icons/io';

const Social = () => {
  return (
    <div className="flex items-center gap-5">
      <Link
        href="https://twitter.com/cully_fung"
        className="
          rounded-md
          p-2
          text-blue-400
          transition-all
          hover:border-blue-400
          hover:bg-blue-400
          hover:text-white
        "
      >
        <IoLogoTwitter size={28} />
      </Link>
      <Link
        href="https://github.com/cullyfung"
        className="
          rounded-md
          p-2
          text-gray-600
          transition-all
          hover:bg-gray-600
          hover:text-white
        "
      >
        <IoLogoGithub size={28} />
      </Link>
    </div>
  );
};

export default Social;
