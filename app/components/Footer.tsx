import React from 'react';

export default function Footer() {
  return (
    <footer
      className="
        my-12
        text-center
        text-sm 
      "
    >
      <p className="opacity-40">
        Built with &nbsp;
        <a
          href="https://nextjs.org"
          className="
            text-primary 
            no-underline
          "
        >
          Next.js
        </a>
        &nbsp; • Deployed on &nbsp;
        <a href="https://vercel.com" className="text-primary">
          Vercel
        </a>
      </p>
      <p className="text-sm opacity-40">&copy;2023&nbsp;cullyfung</p>
    </footer>
  );
}
