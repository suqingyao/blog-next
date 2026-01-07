import { APP_NAME } from '@/constants';

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full border-t border-zinc-100 bg-white/50 py-10 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-8 px-6">
        {/* Info & Copyright */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="font-medium">
              &copy;
              {currentYear}
              {' '}
              {APP_NAME}
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700 sm:block" />
            <span className="flex items-center gap-1.5">
              <span>Built with</span>
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-zinc-800 underline decoration-zinc-300 decoration-1 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary dark:text-zinc-200 dark:decoration-zinc-600"
              >
                Next.js
              </a>
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700 sm:block" />
            <span className="flex items-center gap-1.5">
              <span>Deployed on</span>
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-zinc-800 underline decoration-zinc-300 decoration-1 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary dark:text-zinc-200 dark:decoration-zinc-600"
              >
                Vercel
              </a>
            </span>
          </div>

          <a
            href="https://icp.gov.moe/?keyword=20240127"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 transition-all group-hover:bg-green-500 group-hover:shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
            萌ICP备20240127号
          </a>
        </div>
      </div>
    </footer>
  );
}
