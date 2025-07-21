import { MarkdownContent } from './MarkdownContent';

type MarkdownContentServerProps = Omit<
  React.ComponentProps<typeof MarkdownContent>,
  'highlighter'
>;

export const MarkdownContentServer = async (
  props: MarkdownContentServerProps
) => {
  return <MarkdownContent {...props} />;
};
