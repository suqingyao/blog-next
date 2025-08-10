import { MarkdownContent } from './MarkdownContent';

type MarkdownContentServerProps = Omit<
  React.ComponentProps<typeof MarkdownContent>,
  'highlighter'
>;

export async function MarkdownContentServer(props: MarkdownContentServerProps) {
  return <MarkdownContent {...props} />;
}
