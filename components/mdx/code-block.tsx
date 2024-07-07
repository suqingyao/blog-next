'use client';

import { toast } from 'sonner';

import { useClipboard } from '@/hooks/use-clipboard';

export const CodeBlock = ({ children, raw, ...props }: any) => {
  const { copy } = useClipboard();

  const onCopy = async () => {
    try {
      await copy(raw);
      toast.success('Copied!');
    } catch (error) {
      toast.error('Failed copy');
      console.error('Failed to copy text', (error as Error).message);
    }
  };

  return (
    <pre {...props}>
      <div className="flex items-center justify-between  text-[#000000cc] dark:text-[#ffffffcc]">
        <span className="font-mono text-sm">
          {String(props['data-language']).toUpperCase()}
        </span>
        <button
          role="button"
          onClick={onCopy}
          className="text-xs"
        >
          COPY
        </button>
      </div>

      <div className="mt-2 max-h-[500px] min-h-[50px] overflow-y-auto">
        {children}
      </div>
    </pre>
  );
};
