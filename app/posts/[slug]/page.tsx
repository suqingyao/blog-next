import { getAllPostFiles, getPostBySlug } from '@/app/utils/mdx';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import rehypeShiki from '@/plugins/rehype-shiki';
import shiki from 'shiki';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import remarkToc from 'remark-toc';
import { AiOutlineFieldTime } from 'react-icons/ai';
import PostWrapper from '@/app/components/PostWrapper';
import { format } from 'date-fns';
import components from '@/app/components/MDXComponents';

export default async function Post({ params }: any) {
  const { content: source, frontmatter } = await getPostBySlug(params.slug);

  const { content: mdxComponent } = await compileMDX<Frontmatter>({
    source: source,
    options: {
      mdxOptions: {
        remarkPlugins: [
          remarkGfm,
          remarkFrontmatter,
          [
            remarkMdxFrontmatter,
            {
              name: 'frontmatter'
            }
          ],
          remarkToc
        ],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              properties: {
                className: ['anchor']
              }
              // content: {
              //   type: 'text',
              //   value: '#'
              // }
            }
          ],
          [
            rehypeShiki,
            {
              highlighter: await shiki.getHighlighter({
                theme: 'vitesse-dark'
              })
            }
          ]
        ],
        format: 'mdx'
      }
    },
    components
  });

  return (
    <>
      <h1 className="text-center text-2xl font-bold">{frontmatter.title}</h1>
      <p className="flex flex-row gap-2">
        <span>{format(new Date(frontmatter.date), 'yyyy-MM-dd')}</span>
        <span className="flex flex-row items-center">
          <AiOutlineFieldTime size={20} className="inline-block" />
          {frontmatter.readingTime}
        </span>
      </p>

      <PostWrapper>{mdxComponent}</PostWrapper>
    </>
  );
}

export async function generateStaticParams() {
  const files = await getAllPostFiles();

  return files.map((file) => ({
    slug: file.replace(/\.mdx$/, '').replace('blog/', '')
  }));
}
