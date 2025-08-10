import type { BundledTheme } from 'shiki/themes';
import { ShikiRender } from '@/lib/shiki/client';

export const ShikiRemark: React.FC<{
  codeTheme?: {
    light?: BundledTheme;
    dark?: BundledTheme;
  };
  children?: React.ReactNode;
}> = (props) => {
  const code = pickMdAstCode(props);
  const language = pickCodeLanguage(props);

  return (
    <ShikiRender
      code={code}
      language={language}
      codeTheme={props.codeTheme}
    />
  );
};

function pickMdAstCode(props: any) {
  return props.children?.type === 'code'
    ? (props.children.props.children as string)
    : '';
}

function pickCodeLanguage(props: any) {
  const className
    = props.children?.type === 'code'
      ? (props.children.props.className as string)
      : '';

  if (className?.includes('language-')) {
    return className.replace('language-', '');
  }
  return '';
}
