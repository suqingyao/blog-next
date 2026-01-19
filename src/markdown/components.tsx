import { CheckedIcon, HorizontalIcon, UncheckedIcon } from '@/components/icons';
import { PeekabooLink } from '@/components/links';
import { AdvancedImageContainer } from '@/components/ui/advanced-image';
import { CodeBlock } from '@/components/ui/code-block';
import { DarkToggle } from '@/components/ui/dark-toggle';
import { LinkCard } from '@/components/ui/link-card';
import { LinkPreview } from '@/components/ui/link-preview';
import { createMarkdownHeaderComponent } from '@/components/ui/markdown-render';
import { Mermaid } from '@/components/ui/mermaid';

interface CodeTab {
  label: string;
  code: string;
  language?: string;
}

// Separator used in data-code attribute for multiple code blocks
const CODE_SEPARATOR = '|||';

interface CodeGroupProps {
  'data-labels'?: string;
  'data-code'?: string;
  'data-language'?: string;
  [key: string]: any;
}

interface CodeBlockSingleProps {
  'data-label'?: string;
  'data-code'?: string;
  'data-language'?: string;
  [key: string]: any;
}

/**
 * Handler for <codegroup> custom element
 * Parses data-labels, data-code, data-language attributes
 */
function CodeGroupComponent(props: CodeGroupProps) {
  const dataLabels = props['data-labels'];
  const dataCode = props['data-code'];
  const dataLanguage = props['data-language'];

  if (!dataLabels || !dataCode || !dataLanguage) {
    console.error('CodeGroupComponent: missing required attributes');
    return null;
  }

  try {
    const labels = dataLabels.split(',').map(l => l.trim());
    const codes = dataCode.split(CODE_SEPARATOR);
    const languages = dataLanguage.split(',').map(l => l.trim());

    if (labels.length !== codes.length || labels.length !== languages.length) {
      console.error('CodeGroupComponent: mismatched array lengths');
      return null;
    }

    const tabs: CodeTab[] = labels.map((label, i) => ({
      label,
      code: codes[i],
      language: languages[i] || undefined,
    }));

    return <CodeBlock tabs={tabs} />;
  }
  catch (error) {
    console.error('Failed to parse code group:', error);
    return null;
  }
}

/**
 * Handler for <codeblock> custom element
 * Parses data-label, data-code, data-language attributes
 */
function CodeBlockSingle(props: CodeBlockSingleProps) {
  const dataLabel = props['data-label'];
  const dataCode = props['data-code'];
  const dataLanguage = props['data-language'];

  if (!dataCode) {
    console.error('CodeBlockSingle: missing data-code attribute');
    return null;
  }

  const tab: CodeTab = {
    label: dataLabel || (dataLanguage || 'code'),
    code: dataCode,
    language: dataLanguage || undefined,
  };

  return <CodeBlock tabs={[tab]} />;
}

export const mdxComponents = {
  // hast-util-to-jsx-runtime 可能会转换大小写
  darktoggle: DarkToggle,
  linkcard: LinkCard,
  linkpreview: LinkPreview,
  peekaboolink: PeekabooLink,
  hr: HorizontalIcon,
  mermaid: Mermaid,
  img: AdvancedImageContainer,
  // 任务列表图标组件
  taskcheckedicon: CheckedIcon,
  taskuncheckedicon: UncheckedIcon,
  h1: createMarkdownHeaderComponent('h1'),
  h2: createMarkdownHeaderComponent('h2'),
  h3: createMarkdownHeaderComponent('h3'),
  h4: createMarkdownHeaderComponent('h4'),
  h5: createMarkdownHeaderComponent('h5'),
  h6: createMarkdownHeaderComponent('h6'),
  // Custom code block elements
  codegroup: CodeGroupComponent,
  codeblock: CodeBlockSingle,
};
