export const AppFooter = () => {
  return (
    <footer className="h-footer mt-auto flex w-full items-center justify-center gap-2 py-6 text-center text-sm opacity-80">
      <p>
        Built with &nbsp;
        <a
          href="https://nextjs.org"
          className="text-primary no-underline"
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
      <span className="whitespace-pre opacity-50 select-none">|</span>
      <p>
        <a
          href="https://icp.gov.moe/?keyword=20240127"
          target="_blank"
          className="text-primary"
          rel="noreferrer"
        >
          萌ICP备20240127号
        </a>
      </p>
      <span className="whitespace-pre opacity-50 select-none">|</span>
      <p>&copy;2023&nbsp;suqingyao</p>
    </footer>
  );
};
