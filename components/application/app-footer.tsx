export const AppFooter = () => {
  return (
    <footer className="h-[var(--footer-height)] text-center text-sm">
      <p className="opacity-80">
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
        <a
          href="https://vercel.com"
          className="text-primary"
        >
          Vercel
        </a>
      </p>
      <p className="mt-2 text-sm opacity-80">&copy;2023&nbsp;cullyfung</p>
    </footer>
  );
};
