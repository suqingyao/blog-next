import { Client } from '@notionhq/client';

const auth = process.env.NOTION_ACCESS_TOKEN;

const database_id = process.env.NOTION_DATABASE_ID ?? '';

export type NotionPost = any;

export const notionClient = new Client({ auth });

export const queryNotionPosts = async () => {
  try {
    const response = await notionClient.databases.query({
      database_id
    });

    return response.results.map(pageTransformer);
  } catch (error) {
    return null;
  }
};

export const queryNotionPostById = async (id: string) => {
  try {
    const { results } = await notionClient.blocks.children.list({
      block_id: id
    });

    return {
      data: results
    };
  } catch (error) {
    return null;
  }
};

export function pageTransformer(page: NotionPost) {
  const properties = page.properties;

  function getFieldValue(field: string) {
    const fieldObj = properties?.[field];
    const filedType = fieldObj?.type;

    switch (filedType) {
      case 'select':
        return fieldObj?.[filedType]?.name;
      case 'title':
      case 'rich_text':
        return fieldObj?.[filedType]?.reduce((pre: any, cur: any) => {
          return (pre += cur.text.content);
        }, '');
      default:
        return fieldObj?.[filedType];
    }
  }
  let restObj: any = {};
  (Object.keys(page.properties) || []).forEach((field) => {
    restObj[field] = getFieldValue(field);
  });

  return {
    id: page.id,
    created_time: page.created_time,
    last_edited_time: page.last_edited_time,
    cover: page.cover[page.cover.type].url,
    url: page.url,
    ...restObj
  };
}

export function blockTransformer(block: any) {}

export const getAllNotionPost = async (): Promise<Post[]> => {
  return await fetch(
    `https://notion-api.splitbee.io/v1/table/${database_id}`
  ).then((res) => res.json());
};

export const getNotionPostById = async (id: string) => {
  const posts = await getAllNotionPost();
  const post = posts.find((t) => t.id === id);
  if (!post) {
    return null;
  }

  const response = await fetch(
    `https://notion-api.splitbee.io/v1/page/${post.id}`
  ).then((res) => res.json());

  return {
    frontmatter: {
      ...post
    } as Post,
    content: response
  };
};
