'use client';

import ReactDOM from 'react-dom/client';
import { toast } from 'sonner';

import { useClipboard } from '@/hooks/use-clipboard';

export const CodeBlock = ({ children, ...props }: any) => {
  const { copy } = useClipboard();

  async function simpleRenderToString(element: React.ReactElement) {
    const container = document.createElement('div');
    const root = ReactDOM.createRoot(container);
    root.render(element);

    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(container.innerHTML);
      }, 100);
    });
  }

  const handleCopy = async () => {
    try {
      // 将 ReactNode 转换为 HTML 字符串
      const htmlString = await simpleRenderToString(children);
      // 使用 DOMParser 将 HTML 字符串解析为 DOM 对象
      const domParser = new DOMParser();
      const dom = domParser.parseFromString(htmlString, 'text/html');
      // 提取文本内容
      const textContent = dom.body.textContent;
      // 复制文本内容到剪贴板s
      await copy(textContent!);
      toast.success('Copied!');
    } catch (error) {
      toast.error('Failed copy');
      console.error('Failed to copy text', (error as Error).message);
    }
  };

  return (
    <pre
      {...props}
      className="group relative"
    >
      <div className="absolute right-0 top-0 flex flex-col items-end gap-1 text-[#000000cc] dark:text-[#ffffffcc]">
        <span className="font-mono text-sm">
          {String(props['data-language']).toUpperCase()}
        </span>
        <span
          role="button"
          onClick={handleCopy}
          className="cursor-pointer border-b border-[currentColor] text-right text-xs opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-80"
        >
          COPY
        </span>
      </div>

      <div className="max-h-[500px] min-h-[50px] overflow-y-auto">
        {children}
      </div>
    </pre>
  );
};
