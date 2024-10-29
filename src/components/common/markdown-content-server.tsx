import MarkdownContent from './markdown-content';

type MarkdownContentServerProps = Omit<
  React.ComponentProps<typeof MarkdownContent>,
  'highlighter'
>;

const MarkdownContentServer = async (props: MarkdownContentServerProps) => {
  return <MarkdownContent {...props} />;
};

export default MarkdownContentServer;
