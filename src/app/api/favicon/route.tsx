import * as cheerio from 'cheerio';
import { ImageResponse } from 'next/og';
import { type NextRequest, NextResponse } from 'next/server';
import { consoleLog } from '@/lib/console';

export const runtime = 'edge';
export const revalidate = 259200; // 3 days

function getKey(url: string) {
  return `favicon:${url}`;
}

const cache = new Map<string, string>();

const faviconMapper: { [key: string]: string } = {
  '(?:github.com)': '/favicons/github.png',
  '((?:t.co)|(?:twitter.com)|(?:x.com))': '/favicons/twitter.png',
  'vercel.com': '/favicons/vercel.png',
  'nextjs.org': '/favicons/nextjs.png'
};

function getPredefinedIconForUrl(url: string): string | undefined {
  for (const regexStr in faviconMapper) {
    const regex = new RegExp(
      `^(?:https?:\/\/)?(?:[^@/\\n]+@)?(?:www.)?` + regexStr
    );
    if (regex.test(url)) {
      return faviconMapper[regexStr];
    }
  }

  return undefined;
}

const width = 32;
const height = width;

function getFullUrl(path: string, baseUrl: string): string {
  return path.startsWith('/') ? `${baseUrl}${path}` : path;
}

function renderFavicon(url: string) {
  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={`${url} 的图标`}
        width={width}
        height={height}
      />
    ),
    {
      width,
      height
    }
  );
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.error();
  }

  let iconUrl = cache.get(getKey(url)) || '/favicon_blank.png';

  try {
    const predefinedIcon = getPredefinedIconForUrl(url);
    if (predefinedIcon) {
      cache.set(getKey(url), predefinedIcon);
      const baseUrl = new URL(req.url).origin;
      return renderFavicon(getFullUrl(predefinedIcon, baseUrl));
    }

    const res = await fetch(new URL(`https://${url}`).href, {
      headers: {
        'Content-Type': 'text/html'
      },
      cache: 'force-cache'
    });

    if (res.ok) {
      const html = await res.text();
      const $ = cheerio.load(html);
      const appleTouchIcon = $('link[rel="apple-touch-icon"]').attr('href');
      const favicon = $('link[rel="icon"]').attr('href');
      const shortcutFavicon = $('link[rel="shortcut icon"]').attr('href');
      const finalFavicon = appleTouchIcon ?? favicon ?? shortcutFavicon;
      if (finalFavicon) {
        iconUrl = new URL(finalFavicon, new URL(`https://${url}`).href).href;
      }
    }

    cache.set(getKey(url), iconUrl);
    const baseUrl = new URL(req.url).origin;
    return renderFavicon(getFullUrl(iconUrl, baseUrl));
  } catch {
    consoleLog('ERROR', 'fetch favicon error');
  }

  const baseUrl = new URL(req.url).origin;
  return renderFavicon(getFullUrl(iconUrl, baseUrl));
}
