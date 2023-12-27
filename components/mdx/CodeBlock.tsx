'use client';

import { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { useTheme } from 'next-themes';
import { BiCopy } from 'react-icons/bi';

import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import useClipboard from '@/hooks/useClipboard';

const CodeBlock = ({ children, ...props }: any) => {
  const { theme } = useTheme();
  const { isSupported, text, copy } = useClipboard();

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
      // 复制文本内容到剪贴板
      await copy(textContent!);
      toast.success('Copy Success!');
    } catch (error) {
      toast.error('Failed copy');
      console.error('Failed to copy text', (error as Error).message);
    }
  };

  const isShowCurrentTheme = useMemo(() => {
    return theme === props['data-theme'];
  }, [props, theme]);

  return (
    <pre
      {...props}
      className={cn(
        'h-max-[500px] group m-0 my-2 hidden overflow-y-auto rounded',
        isShowCurrentTheme && 'block'
      )}
    >
      <div className="flex items-center justify-between px-2 py-2 text-sm text-primary/80 group-hover:text-primary">
        <span className="font-mono">
          {String(props['data-language']).toUpperCase()}
        </span>
        <BiCopy
          role="button"
          size={20}
          onClick={handleCopy}
        />
      </div>

      {children}
    </pre>
  );
};

export default CodeBlock;
