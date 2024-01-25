import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import readingTime from 'reading-time';
import type {
  PageObjectResponse,
  TextRichTextItemResponse
} from '@notionhq/client/build/src/api-endpoints';
import dayjs from 'dayjs';
import { compileRawToPost } from '@/utils/mdx';

const auth = process.env.NOTION_ACCESS_TOKEN;

const database_id = process.env.NOTION_DATABASE_ID ?? '';

export const notionClient = new Client({ auth });

export const notionToMarkDown = new NotionToMarkdown({ notionClient });

export const queryAllNotionPost = async () => {
  try {
    const response = await notionClient.databases.query({
      database_id
    });

    return (response.results as PageObjectResponse[]).map(
      pageTransformer
    ) as Post[];
  } catch (error) {
    return [];
  }
};

// export const queryNotionPostById = async (id: string) => {
//   try {
//     const { results } = await notionClient.blocks.children.list({
//       block_id: id
//     });

//     return {
//       data: results
//     };
//   } catch (error) {
//     return null;
//   }
// };

export const queryNotionPostById = async (id: string) => {
  const posts = await getAllNotionPost();

  const post = posts.find((post) => post.id === id);

  if (!post) {
    return null;
  }

  const mdblocks = await notionToMarkDown.pageToMarkdown(id);
  const { parent: raw } = notionToMarkDown.toMarkdownString(mdblocks);

  const { content } = await compileRawToPost(raw);

  return {
    frontmatter: {
      ...post,
      readingTime: readingTime(raw).text.split('read')[0]
    } as Post,
    content
  };
};

export function pageTransformer(page: PageObjectResponse): Record<string, any> {
  const properties = page.properties;

  function getFieldValue(field: string) {
    const fieldObj = properties?.[field];
    const filedType = fieldObj?.type;

    switch (filedType) {
      case 'select':
        return fieldObj?.[filedType]?.name;
      case 'title':
        return fieldObj?.[filedType].reduce((pre, cur) => {
          return pre + cur.plain_text;
        }, '');
      case 'rich_text':
        return (fieldObj[filedType] as TextRichTextItemResponse[])?.reduce(
          (pre, cur) => {
            return pre + cur.text.content;
          },
          ''
        );
      case 'status':
        return fieldObj[filedType]?.name;
      case 'checkbox':
        return fieldObj[filedType];
      // TODO parse reset type
      default:
        return fieldObj;
    }
  }
  let restObj: any = {};
  (Object.keys(page.properties) || []).forEach((field) => {
    restObj[field] = getFieldValue(field);
  });

  return {
    id: page.id,
    createdTime: dayjs(page.created_time).format('YYYY-MM-DD hh:mm:ss'),
    lastEditedTime: dayjs(page.last_edited_time).format('YYYY-MM-DD hh:mm:ss'),
    cover:
      page.cover && page.cover.type === 'external'
        ? page.cover?.external?.url
        : page.cover?.file.url,
    url: page.url ?? undefined,
    ...restObj
  };
}

export const getAllNotionPost = async (): Promise<Post[]> => {
  return await fetch(
    `https://notion-api.splitbee.io/v1/table/${database_id}`
  ).then((res) => res.json());
};

// export const getNotionPostById = async (id: string) => {
//   const posts = await getAllNotionPost();
//   const post = posts.find((t) => t.id === id);
//   if (!post) {
//     return null;
//   }

//   const response = await fetch(
//     `https://notion-api.splitbee.io/v1/page/${post.id}`
//   ).then((res) => res.json());

//   return {
//     frontmatter: {
//       ...post
//     } as Post,
//     content: response
//   };
// };
