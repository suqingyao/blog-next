import { Time } from '@/components/common/time';
// import { BlockchainIcon } from '@/components/icons/BlockchainIcon';
// import { EditButton } from '@/components/site/EditButton';
import PostTag from '@/components/site/post-tag';
import { UniLink } from '@/components/ui/uni-link';
import { RESERVED_TAGS } from '@/lib/constants';
import { CalendarIcon } from '../icons';
// import { CSB_SCAN } from '@/lib/env';
// import { ExpandedCharacter, ExpandedNote, NoteType } from "@/lib/types"

// import TranslationInfo from "./TranslationInfo"

export default async function PostMeta({
  post,
  summary,
  translated
}: {
  post: Record<string, any>;
  summary?: string;
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
        {post?.tags?.filter((tag: any) => !RESERVED_TAGS.includes(tag))
          .length ? (
          <>
            <span className="post-tags min-w-0 space-x-1 truncate">
              {post.metadata?.content?.tags
                ?.filter((tag: any) => !RESERVED_TAGS.includes(tag))
                .map((tag: any) => (
                  <PostTag
                    key={tag}
                    tag={tag}
                  />
                ))}
            </span>
          </>
        ) : null}
        {/* <span className="xlog-post-views inline-flex items-center">
          <i className="i-mingcute-eye-line mr-[2px]" />
          <span>{post.stat?.viewDetailCount}</span>
        </span> */}
        {/* <UniLink
          className="post-blockchain inline-flex items-center"
          href={`${CSB_SCAN}/tx/${page.updatedTransactionHash}`}
        >
          <BlockchainIcon className="fill-zinc-500 ml-1" />
        </UniLink> */}
        {/* <EditButton
          handle={site?.handle}
          noteId={page.noteId}
          type={page.metadata?.content?.tags?.[0] as NoteType}
        /> */}
      </div>
      {/* <TranslationInfo page={page} /> */}
      {summary && (
        <div className="post-summary mt-5 space-y-2 rounded-xl border p-4">
          <div className="flex items-center font-bold text-zinc-700">
            <i className="i-mingcute-sparkles-line mr-2 text-lg" />
            {translated?.['AI-generated summary'] || 'AI-generated summary'}
          </div>
          <div className="text-sm leading-loose text-zinc-500">{summary}</div>
        </div>
      )}
    </div>
  );
}
