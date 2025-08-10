import { Time } from '@/components/common/Time';
import PostTag from '@/components/site/PostTag';
import { MarkdownContent } from '@/components/ui/markdown/MarkdownContent';
import { RESERVED_TAGS } from '@/constants';
import { CalendarIcon } from '../icons';
// import TranslationInfo from "./TranslationInfo"

export default async function PostMeta({
  post,
  translated,
}: {
  post: Record<string, any>;
  translated?: {
    'AI-generated summary': string;
  };
}) {
  return (
    <div className="post-meta">
      <div className="mt-5 flex items-center justify-center space-x-5 text-zinc-400">
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <Time isoString={post?.createdTime} />
        </div>
        {post?.tags?.filter((tag: string) => !RESERVED_TAGS.includes(tag))
          .length
          ? (
              <>
                <span className="post-tags min-w-0 space-x-1 truncate">
                  {post?.tags
                    ?.filter((tag: string) => !RESERVED_TAGS.includes(tag))
                    .map((tag: string) => (
                      <PostTag
                        key={tag}
                        tag={tag}
                      />
                    ))}
                </span>
              </>
            )
          : null}
      </div>
      {/* <TranslationInfo page={page} /> */}
      {post.summary && (
        <div className="post-summary mt-6 space-y-3 rounded-xl border border-zinc-200/60 bg-zinc-50/50 p-4 backdrop-blur-sm transition-colors dark:border-zinc-800/60 dark:bg-zinc-900/50">
          <div className="flex items-center font-semibold text-zinc-700 dark:text-zinc-300">
            <i className="i-mingcute-sparkles-line text-primary mr-2 text-lg" />
            {translated?.['AI-generated summary'] || 'AI-generated summary'}
          </div>
          <div className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            <MarkdownContent
              content={post.summary}
              onlyContent={true}
              strictMode={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
